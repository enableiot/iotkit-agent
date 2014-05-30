/**
 * Created by ammarch on 5/27/14.
 */
"use strict";
var rest = require("../../api/rest");


function IoTKitRestCloud(conf, logger, rest) {
    var me = this;
    me.config = conf;
    me.logger = logger;
    me.client = rest;
    me.type = 'rest';
    me.logger.debug('Rest Proxy Created');
}
IoTKitRestCloud.prototype.component = function (data) {
    var me = this;
    me.logger.debug("Reg Components : %j", data, {});
    var token = data.deviceToken;
    delete data.deviceToken;
    var dataPayload = {deviceId : data.deviceId,
                       deviceToken: token,
                       body: data
                    };
    me.logger.debug("Registering Components ", dataPayload);
    me.client.devices.registerComponents(dataPayload, function (err, response) {
        if (!err && response) {
            me.logger.debug ("Device Component has registered : ", response);
        } else {
            me.logger.error ("Device Component has fail : ", err);
        }
    });
};
IoTKitRestCloud.prototype.data = function (data) {
    var me = this;
    me.logger.debug("Metric doc: %j", data, {});
    var token = data.deviceToken;
    delete data.deviceToken;
    var dataPayload = {deviceId : data.deviceId,
                       deviceToken: token,
                       body: data.convertToRestPayload()
                       };

    me.client.devices.submitData(dataPayload, function (err, reponse) {
        if (!err && reponse) {
            me.logger.debug("Response From data Submission from API", reponse);
        } else {
            me.logger.error("Data Submission Error ", err);
        }

    });
};
IoTKitRestCloud.prototype.attributes = function (data) {
    var me = this;
    me.logger.debug("Attributes Registration : ");
    var token = data.deviceToken;
    delete data.deviceToken;
    var dataPayload = {
                deviceId : data.deviceId,
                deviceToken: token,
                body: data
                };
    me.logger.debug("Attributes , ", dataPayload);
    me.client.devices.updateMetadataDevice(dataPayload, function(err, response){
        if (!err && response) {
            me.logger.debug ("Metadata Device: ", dataPayload.deviceId,  "Updated : ", response);
        } else  {
            me.logger.error("Metadata Device : ", dataPayload.deviceId,  "could not be updated ", err);
        }
    });
};

module.exports.init = function(conf, logger) {
    return new IoTKitRestCloud(conf, logger, rest);
};







