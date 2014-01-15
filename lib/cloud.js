var mqtt = require('mqtt'),
    fs = require('fs'),
    conf = process.env;

function IoTKitCloud(logger, deviceId){
  var me = this;
  
  me.cloudConfigPath = "./cloud.json";
  me.logger = logger;

  var args = {};

  if (fs.existsSync(me.cloudConfigPath)) { 
    args = require(me.cloudConfigPath);
  }

  /* Sample Cloud Override File
     Path: ./cloud.json (root of the agent app)

    {
      host: 'data.enableiot.com',
      port: 8884,
      qos: 1,
      username: 'testuser',
      password: 'password'
    }

  */
  
  var host = args.host || conf.BROKER_HOST || 'data.enableiot.com';
  var port = args.port || conf.BROKER_PORT || 8884;
  var topic_root = conf.BROKER_DATA_TOPIC || "data";
  me.ping_topic = conf.BROKER_PING_TOPIC || "ping";
  var pubQos = args.qos || conf.BROKER_PUB_QOS || 1;
  var pubRetain = conf.BROKER_PUB_RETAIN || true;
  var args = {
     keyPath: conf.BROKER_HOST_KEY || './certs/client.key',
     certPath: conf.BROKER_HOST_CERT || './certs/client.crt',
     username: args.username || conf.BROKER_HOST_USR || conf.IOTKIT_AGENT_USR || 'testuser',
     password: args.password || conf.BROKER_HOST_PSW || conf.IOTKIT_AGENT_PSW || 'password',
     keepalive: 59000
  };

  me.deviceId = deviceId;
  me.accountId = args.username;
  me.topic = topic_root + "/" + me.accountId + "/" + me.deviceId;
  me.client = mqtt.createSecureClient(port, host, args);
  me.logger.info('Cloud client created');
  me.item_template = { 
    name: "",
    sample: [ { "value": 0, "timestamp": 0 } ]
  }

  me.getTimestamp = function(){
      return new Date().getTime();
  };

  me.cloneObject = function(obj1){
      return JSON.parse(JSON.stringify(obj1));
  };

  me.makeItem = function(name, value){
    var me = this;
    var item = me.cloneObject(me.item_template);
        item.name = name;
        item.sample[0].value = value;
        item.sample[0].timestamp = me.getTimestamp();
    return item;
  };

  me.sample = {
    s: "temp-sensor", 
    m: "air-temp", 
    v: 26.7
  };

  me.pubArgs = {
    qos: pubQos, 
    retain: pubRetain
  };

};

IoTKitCloud.prototype.ping = function(id, ips){
  var me = this;

  if (!id || !ips) {
    logger.error('Null argument');
    return;
  }

  var msg = {
    ts: new Date().getTime(),
    host: id,
    addresses: ips
  }

  me.logger.debug('Sending: ', msg);
  me.client.publish(me.ping_topic, JSON.stringify(msg), me.pubArgs);

};


IoTKitCloud.prototype.send = function(doc){
  var me = this;

  // 
  // Validate the input args
  if (!doc || !doc.s || !doc.m || !doc.v) {
    logger.error('Invalid document format. Expected %s got %s', 
      me.sample, doc);
    return;
  }

  // Setup base message
  var msg = {
      msg_type: "metrics_msg",
      sender_id: me.deviceId,
      account_id: me.accountId,
      timestamp: me.getTimestamp(),
      data_source: [{
        name: doc.s,
        metrics: []
      }]
  };

  // Add metrics to the message
  msg.data_source[0].metrics[0] = me.makeItem(doc.m, doc.v);

  // Send to broker
  me.logger.debug('Sending: ', msg);
  me.client.publish(me.topic, JSON.stringify(msg), me.pubArgs);

};


exports.init = function(logger, deviceId) {
  return new IoTKitCloud(logger, deviceId);
};  



