var os = require('os');

function IoTKitCloudMessages(conf, logger){
  var me = this;
  me.conf = conf;
  me.logger = logger;
  me.utils = require('./utils').init(logger);

  
  this.makeItem = function(name, value){
    var item = {name:"",sample:[{"value":0,"timestamp":0}]};
        item.name = name;
        item.sample[0].value = value;
        item.sample[0].timestamp = me.utils.getTimeStamp();
    return item;
  };

};

IoTKitCloudMessages.prototype.getRegMsg = function(deviceId, deviceName, dataSrcName, dataType, dataUnit){
  var me = this;

  if (!deviceId){
    me.logger.error("Null argument (deviceId)");
    return;
  }

  if (!deviceName) deviceName = deviceId;
  if (!dataSrcName) dataSrcName = deviceName + "-sensor";
  if (!dataType) dataType = "float";
  if (!dataUnit) dataUnit = "number";

  var metricName = dataSrcName + "-metric";

  var msg = {
    "protocol_version": "1.0",
    "timestamp": me.utils.getTimeStamp(),
    "sender_id": deviceId,
    "msg_type": "device_registration_msg",
    "properties": {
      "hardware_vendor": os.cpus()[0].model,
      "hardware_model": os.platform(),
      "Model Name": os.arch(),
      "Firmware Version": os.release()
    },
    "peripherals": [
      {
        "uuid": "self",
        "type": "gateway",
        "properties": {},
        "services": [
          {
            "name": dataSrcName,
            "version": "1.0"
          }
        ]
      }
    ],
    "service_metadata": [
      {
        "loaded": true,
        "capabilities": [],
        "enabled": true,
        "name": dataSrcName,
        "version": "1.0",
        "metrics": [
          {
            "units": dataUnit,
            "data_type": dataType,
            "items": 1,
            "name": deviceName
          }
        ]
      }
    ]
  };

  return msg;

};


IoTKitCloudMessages.prototype.send = function(deviceId, accountId, doc){
  var me = this;

  if (!deviceId){
    me.logger.error("Null argument (deviceId)");
    return;
  }

  if (!accountId){
    me.logger.error("Null argument (accountId)");
    return;
  }

  // Validate the input args
  if (!doc || !doc.s || !doc.m || !doc.v) {
    logger.error('Invalid document format. Expected %s got %s', 
      me.sample, doc);
    return;
  }

  // Setup base message
  var msg = {
      msg_type: "metrics_msg",
      sender_id: deviceId,
      account_id: accountId,
      timestamp: me.utils.getTimeStamp(),
      data_source: [{
        name: doc.s,
        metrics: []
      }]
  };

  // Add metrics to the message
  msg.data_source[0].metrics[0] = me.makeItem(doc.m, doc.v);

  return msg;

};


exports.init = function(conf, logger) {
  return new IoTKitCloudMessages(conf, logger);
};  



