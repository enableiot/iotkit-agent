var mqtt = require('mqtt'),
    conf = process.env;

function IoTKitCloud(logger, deviceId){
  var me = this;
  
  me.logger = logger;
  
  var host = conf.BROKER_HOST || 'data.enableiot.com';
  var port = conf.BROKER_PORT || 8884;
  var topic_root = conf.BROKER_DATA_TOPIC || "data";
  var args = {
     keyPath: conf.BROKER_HOST_KEY || '../certs/client.key',
     certPath: conf.BROKER_HOST_CERT || '../certs/client.crt',
     username: conf.BROKER_HOST_USR || conf.IOTKIT_AGENT_USR || 'testuser',
     password: conf.BROKER_HOST_PSW || conf.IOTKIT_AGENT_PSW || 'password',
     keepalive: 59000
  };

  me.deviceId = deviceId;
  me.accountId = args.username;
  me.topic = topic_root + "/" + me.accountId + "/" + me.deviceId;
  me.client = mqtt.createSecureClient(port, host, args);
  me.logger.info('Cloud client created');
  me.item_template = { 
    "name": "",
    "sample": [ { "value": 0, "timestamp": 0 } ]
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
    "s": "temp-sensor", 
    "m": "air-temp", 
    "v": 26.7
  };

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
      "msg_type": "metrics_msg",
      "sender_id": me.deviceId,
      "account_id": me.accountId,
      "timestamp": me.getTimestamp(),
      "data_source": [{
        "name": doc.s,
        "metrics": []
      }]
  };

  // Add metrics to the message
  msg.data_source[0].metrics[0] = me.makeItem(doc.m, doc.v);

  // Send to broker
  me.logger.debug('Sending: ', msg);
  me.client.publish(me.topic, JSON.stringify(msg));

};


exports.init = function(logger, deviceId) {
  return new IoTKitCloud(logger, deviceId);
};  



