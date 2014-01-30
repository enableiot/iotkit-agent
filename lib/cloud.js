var mqtt = require('mqtt'),
    msg = require('./cloud-message').init();

function IoTKitCloud(conf, logger, deviceId){
  var me = this;

  me.logger = logger;

  var host = conf.host || 'data.enableiot.com';
  var port = conf.port || 8884;
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
  me.pubArgs = {
    qos: conf.qos || 1, 
    retain: conf.retain || true
  };

  me.client = mqtt.createSecureClient(port, host, args);
  me.logger.info('Cloud client created');

  me.topics = {
    reg: conf.reg_topic || '/server/registration',
    status: conf.status_topic || '/server/registration_status',
    metric: conf.metric_topic || '/server/metric/'
  };

  // add the state specifics 
  me.topics.metric += args.username + '/' + deviceId;

  me.client
  .subscribe(me.topics.status)
  .on('message', function(topic, message) {
    me.logger.info('STATUS: %s', topic, message);
    // TODO: implement  
  });

};

IoTKitCloud.prototype.reg = function(sensorList) {
  var me = this;

  var doc = msg.getRegMsg(me.deviceId, undefined, undefined, sensorList);
  me.logger.debug("Reg doc: %j", doc, {});
  me.pub(me.topics.reg, doc);

};

IoTKitCloud.prototype.metric = function(message){
  var me = this;
  var doc = msg.getMetricMsg(me.deviceId, me.accountId, message);
  me.logger.debug("Metric doc: %j", doc, {});
  me.pub(me.topics.metric, doc);

};


IoTKitCloud.prototype.pub = function(topic, doc){
  var me = this;

  // Validate the input arg
  if (!doc || !topic) {
    logger.error('send: null args');
    return;
  }

  // Send to broker
  me.logger.debug('SEND: %s', topic, doc);
  me.client.publish(topic, JSON.stringify(doc), me.pubArgs);

};


exports.init = function(conf, logger, deviceId) {
  return new IoTKitCloud(conf, logger, deviceId);
};  



