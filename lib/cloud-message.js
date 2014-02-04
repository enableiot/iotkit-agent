<<<<<<< HEAD
=======
/*
Copyright (c) 2012, Intel Corporation

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.
    * Neither the name of Intel Corporation nor the names of its contributors
      may be used to endorse or promote products derived from this software
      without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

>>>>>>> e8f0df0223d11cfebd705cae70159c121322d7f2
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
        metrics: [ { name: doc.m,
                     sample: [{
                                  value: doc.v,
                                  timestamp: me.utils.getTimeStamp()
                     }]
                  } ]
        }]
  };



  return msg;

};


exports.init = function(conf, logger) {
  return new IoTKitCloudMessages(conf, logger);
};  



