var os = require('os');

function IoTKitCloudMessages(conf, logger){
  var me = this;
  me.conf = conf;
  me.logger = logger;
  me.utils = require('./utils').init(logger);

};

IoTKitCloudMessages.prototype.getRegMsg = function(deviceId, deviceName, dataSrcName, sensorList) {
  var me = this;

  if (!deviceId){
    me.logger.error("Null argument (deviceId)");
    return;
  }

  if (!deviceName) deviceName = deviceId;
  if (!dataSrcName) dataSrcName = deviceName + "-sensor";

  var sensorArray = [];
  for (var sensorName in sensorList) {
      sensorArray.push(sensorList[sensorName]);
  }

  //var metricName = dataSrcName + "-metric";

  var msg = {
    "protocol_version": "1.0",
    "timestamp": me.utils.getTimeStamp(),
    "sender_id": deviceId,
    "msg_type": "device_registration_msg",
    "properties": {

      //TODO: Check this values. They not seem to be right.
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
        "metrics": sensorArray
      }
    ]
  };

  return msg;

};


IoTKitCloudMessages.prototype.getMetricMsg = function(deviceId, accountId, doc){
  var me = this;

  if (!deviceId){
    me.logger.error("Null argument (deviceId)");
    return;
  }

  if (!accountId){
    me.logger.error("Null argument (accountId)");
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
        metrics: [ {    name: doc.m,
                        sample: [ {
                                    value: doc.v,
                                    timestamp: me.utils.getTimeStamp()
                                    }
                                ]
                    } ]
        }]
  };



  return msg;

};


exports.init = function(conf, logger) {
  return new IoTKitCloudMessages(conf, logger);
};  



