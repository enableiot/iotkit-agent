var mqtt = require('mqtt');

function IoTKitCloud(conf, logger, deviceId){
  var me = this;

  me.logger = logger;

  var host = conf.host || 'data.enableiot.com';
  var port = conf.port || 8884;
  var topic_root = "data";
  me.ping_topic = "ping";
  var pubQos = conf.qos || 1;
  var pubRetain = true;
  var args = {
     clientId: deviceId,
     keyPath: conf.key || './certs/client.key',
     certPath: conf.crt || './certs/client.crt',
     username: conf.username || 'newdevice',
     password: conf.password || 'iotkit',
     keepalive: 59000
  };

  me.deviceId = deviceId;
  me.accountId = args.username;
  me.topic = topic_root + "/" + me.accountId + "/" + deviceId;
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

  me.logger.debug('PING: ', msg);
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
  me.logger.debug('DATA: ', msg);
  me.client.publish(me.topic, JSON.stringify(msg), me.pubArgs);

};


exports.init = function(conf, logger, deviceId) {
  return new IoTKitCloud(conf, logger, deviceId);
};  



