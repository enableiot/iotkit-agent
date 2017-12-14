/*
Copyright (c) 2014, Intel Corporation

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

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

IoTKitRestCloud.prototype.addComponent = function (data, callback) {
    var me = this;
    me.logger.debug("Reg Components : %j", data, {});
    var token = data.deviceToken;
    delete data.deviceToken;
    var did = data.deviceId;
    delete data.deviceId;
    var dataPayload = {
        deviceId : did,
        deviceToken: token,
        body: data
    };
    me.logger.debug("Registering components ...", dataPayload);
    me.client.devices.registerComponents(dataPayload, function (err, response) {
        var comp = {};
        if (!err && response) {
            me.logger.debug("Component registered : ", response);
            comp = response;
            comp.status = 0;
            callback(comp);
        } else {
            me.logger.error ("Component registration failed : ", err);
            comp = new Error ("Component registration failed");
            comp.status = 3001;
            callback(comp);
        }
    });
};

IoTKitRestCloud.prototype.data = function (data , callback) {
    var me = this;
    me.logger.debug("Metric doc: %j", data, {});
    var token = data.deviceToken;
    delete data.deviceToken;
    delete data.gatewayId;
    var dataPayload = {
        deviceId : data.did,
        deviceToken: token,
        body: data.convertToRestPayload()
    };

    me.client.devices.submitData(dataPayload, function (err, response) {
        var data = {};
        if (!err) {
            me.logger.debug("Response From data Submission from API");
            data.response = response || "none detail";
            data.status = 0;
            return callback(data);
        } else {
            me.logger.error("Data Submission Error ", err);
            data = new Error("Data Submission Fail");
            data.status = 4000;
            return callback(err);
        }
    });
};

IoTKitRestCloud.prototype.attributes = function (data, callback) {
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
    me.client.devices.updateMetadataDevice(dataPayload, function(err, response) {
        if (!err && response) {
            callback(response);
            me.logger.debug ("Metadata Device: ", dataPayload.deviceId,  "Updated : ", response);
        } else  {
            me.logger.error("Metadata Device : ", dataPayload.deviceId,  "could not be updated ", err);
            callback(err);
        }
        return true;
    });
    return true;
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
            if (response) {
                me.logger.error('Activation Rejected: { ', response, '} --> error ');
            }
            if(err) {
                me.logger.error('Activation Rejected: ', err, ' --> error ');
            }
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
    me.logger.debug("Starting Health testing");
    me.client.publicApi.health(function (err, response) {
        if (!err && response) {
            me.logger.debug("Response From data Submission from API", response);
            callback(response);
        } else {
            me.logger.error("Data Submission Error ", err);
            callback(null);
        }

    });
};

IoTKitRestCloud.prototype.getCatalog = function (data, callback) {
    var me = this;
    me.logger.info("Starting Catalog Retrieving ");
    var dataPayload = {
        deviceToken: data.deviceToken
    };
    me.client.cmpcatalog.getCatalog(dataPayload, function (err, response) {
        if (!err && response) {
            me.logger.debug("Response From Catalog Retrieved ", response);
            callback(response);
        } else {
            me.logger.error("Catalog Retrieved Error  ", err);
            callback(null);
        }

    });
};

IoTKitRestCloud.prototype.getDevice = function (data, callback) {
    var me = this;
    me.logger.debug("Getting device : ");
    var dataPayload = {
        deviceId : data.deviceId,
        deviceToken: data.deviceToken
    };
    me.logger.debug("Attributes , ", dataPayload);
    me.client.devices.getDevice(dataPayload, function(err, response) {
        if (!err && response) {
            callback(response);
            me.logger.debug ("Metadata Device: ", data.deviceId,  "Downloaded : ", response);
        } else  {
            me.logger.error("Metadata Device : ", data.deviceId,  "could not be downloaded ", err);
            callback(err);
        }
        return true;
    });
    return true;
};

IoTKitRestCloud.prototype.pullActuations = function (data, callback) {
    var me = this;
    me.logger.info("Starting Actuations pulling ");
    me.client.control.pullActuations(data, function (err, response) {
        if (!err && response) {
            me.logger.info("Actuations pulled successfully");
            callback(response);
        } else {
            me.logger.error("Actuations pull retrieved error  ", JSON.stringify(err));
            callback(null);
        }
    });
};

IoTKitRestCloud.prototype.setCredential = function (user, password) {
    var me = this;
    me.crd = {
        username: user || '',
        password: password || ''
    };
    me.logger.debug("The user is: ", user , " and password ", password);
};

IoTKitRestCloud.prototype.getActualTime = function (callback) {
    var me = this;
    me.logger.info("Starting Time Retrieving ");
    me.client.publicApi.getActualTime(function (err, response) {
        if (!err && response) {
            me.logger.debug("Response From Time Retrieving", response);
            callback(response.actualTime);
        } else {
            me.logger.error("Time Retrieved Error ", err);
            callback(null);
        }
    });
};


module.exports.init = function(conf, logger) {
    return new IoTKitRestCloud(conf, logger, rest);
};
