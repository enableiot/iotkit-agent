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
IoTKitRestCloud.prototype.addComponent = function (data) {
    var me = this;
    me.logger.debug("Reg Components : %j", data, {});
    var token = data.deviceToken;
    delete data.deviceToken;
    var did = data.deviceId;
    delete data.deviceId;
    var dataPayload = {deviceId : did,
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
    var did = data.deviceId;
    delete data.deviceId;
    var dataPayload = {
                deviceId : did,
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
IoTKitRestCloud.prototype.activation = function (data, callback) {
    var me = this;
    me.logger.debug('Called activate function');
    me.logger.debug('...trying activation');

    var did = data.deviceId;
    delete data.deviceId;
    var actResData = {
                deviceId: did,
                body: {"activationCode": data.code}
        };
    me.client.devices.registerDevice(actResData, function (err, response) {
        me.logger.debug("Device Register", response);
        var secret = { };
        if (!err && response && response.deviceToken && response.domainId) {
            secret.deviceToken = response.deviceToken;
            secret.accountId = response.domainId;
            secret.status = 0;
        } else {
            me.logger.error('Activation Rejected: { ' , response , '} --> error ');
            secret = new Error("Activation Rejected");
            secret.status = 300;
        }
        callback(secret);
    });
};

IoTKitRestCloud.prototype.disconnect = function () {
    var me = this;
    me.logger.debug("Disconnect Called");
};

IoTKitRestCloud.prototype.health = function (device, callback) {
    var me = this;
    me.logger.debug("Staring Health testing");
    me.client.admin.health(function (err, response) {
        if (!err && response) {
            me.logger.debug("Response From data Submission from API", response);
            callback(response);
        } else {
            me.logger.error("Data Submission Error ", err);
            callback(null);
        }

    });
};

module.exports.init = function(conf, logger) {
    return new IoTKitRestCloud(conf, logger, rest);
};
