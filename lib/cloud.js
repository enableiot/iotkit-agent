/*
 Copyright (c) 2013, Intel Corporation

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
"use strict";
var mqtt = require('mqtt'),
    msg = require('./cloud-message').init(),
    fs = require('fs');

/**
 * @description Build a path replacing patter {} by the data arguments
 * if more the one {} pattern is present it shall be use Array
 * @param path string the represent a URL path
 * @param data Array or string,
 * @returns {*}
 */
var buildPath = function (path, data) {
    var re = /{\w+}/;
    var pathReplace = path;
    if (Array.isArray(data)) {
        data.forEach(function (value) {
            pathReplace = pathReplace.replace(re, value);
        });
    } else {
        pathReplace = pathReplace.replace(re, data);
    }
    return pathReplace;
};
function writeCodeinJson(filename, data) {
    fs.writeFile(filename, JSON.stringify(data, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("JSON saved to " + filename);
        }
    });
}
function IoTKitCloud(conf, broker, logger, deviceId, sensorsStore){
    //TODO refactor as Gateway - Broker codes.
    var me = this;
    me.logger = logger;
    me.secret = require('../certs/token.json');
    me.sensorsStore = sensorsStore;
    me.sensorsList = {};
    me.client = broker;
    me.deviceId = deviceId;
    me.activationCode = conf.activation_code;
    me.apiKey = conf.apikey;
    me.accountId = "anon";
    me.logger.info("device id: ", me.deviceId);
    me.logger.info('Cloud client created');
    me.topics = {
        reg: conf.reg_topic || '/server/registration',
        status: conf.status_topic || '/server/registration_status',
        metric: conf.metric_topic || '/server/metric/',
        device: conf.device || "devices/{deviceid}",
        device_activation: conf.device_activation || "devices/{deviceid}/activation",
        device_metadata: conf.device_metadata ||"devices/{deviceid}/metadata",
        device_status: conf.device_status || "devices/{deviceid}/activation_status",
        metric_topic: conf.metric_topic || "server/metric/{accountid}/{deviceid}",
        device_component: conf.device_components || "devices/{deviceid}/components"
    };
    me.activationCompleted = false;
    me.pubArgs = {
        qos: 1,
        retain: false
    };
/*    me.client.subscribe(buildPath(me.topics.device_status, me.deviceId))
        .on('message', function(topic, message) {
            me.logger.info('STATUS: %s', topic, message);
            var regStatus = null;
            try {
                regStatus = JSON.parse(message);
            } catch (e){
                me.logger.info('STATUS: %s. Cannot parse message: ', topic, message);
                regStatus = null;
            }
            //status = 1 --> mean activated
            if (regStatus && regStatus.status === 1) {
                me.deviceToken = regStatus.deviceToken;
                me.accountId = regStatus.accountId;
                me.activationCompleted = true;
                me.logger.info('Devices activated successfully');
            }
        });*/
/*    me.activate = function (callback) {
        var actMsg = {
            "activationCode": me.activationCode,
            "apiKey": me.apiKey
        };
        me.logger.info('Called activate');
        me.client.publish(buildPath(me.topics.device_activation, me.deviceId),
                            JSON.stringify(actMsg),
                            me.pubArgs);
        me.logger.info('Activate - pub done');
        function waitForActivation() {
            var retries = 0;
            if (!me.activationCompleted) {
                retries ++;
                if (retries < 10) {
                    setTimeout(waitForActivation, 500);
                } else {
                    callback(new Error("The Activation token has not received"));
                }
            } else {
                callback(null);
            }
        }
        waitForActivation();
    };*/
}
/**
 * Handler to wait the token from MQTT server, the token is use to auth metrics send by the device
 * @param topic
 * @param message
 */
IoTKitCloud.prototype.waitForToken = function () {
     var me = this;
       var handler = function (topic, message) {
           me.logger.info('STATUS: %s', topic, message);
           //status = 1 --> mean activated
           if (message && message.status === 1) {
               me.secret.deviceToken = message.deviceToken;
               me.secret.accountId = message.accountId;
               me.activationCompleted = true;
               me.logger.info('Devices activated successfully');
           }
       };

    return handler;
};
/**
 * Will send the activation code to MQTT Server.
 * @param code (optional)
 */
IoTKitCloud.prototype.sendActivationCode = function(code) {
    var me = this;
    var actMsg = {
        "activationCode": code || me.activationCode,
        "apiKey": me.apiKey
    };
    var args = {
        qos : 1,
        retain: false
    };
    me.logger.debug('Sending Activation Code');
    me.client.publish(buildPath(me.topics.device_activation, me.deviceId), actMsg, args);
};

/**
 * It will activate the device, by sending the activation code and receiving the token
 * from server if the toke is at device the activation will not called.
 * @param callback
 */
IoTKitCloud.prototype.activate = function (callback) {
    var me = this;
    me.logger.debug('Called activate function');
    function waitForActivation() {
        if (!me.activationCompleted) {
            retries ++;
            if (retries < 30) {
                setTimeout(waitForActivation, 1000);
            } else {
                callback(new Error("The Activation token has not received"));
            }
        } else {
            me.client.unbind(tokenTopic);
            writeCodeinJson("../certs/token.json", me.secret);
            callback(null);
        }
    }
    if (!me.secret.deviceToken) {
        var tokenTopic = buildPath(me.topics.device_status, me.deviceId);
        me.client.bind(tokenTopic, me.waitForToken());
        me.sendActivationCode();
        var retries = 0;
        waitForActivation();
    } else {
        callback(null);
    }
};

IoTKitCloud.prototype.reg = function(sensorsListArg) {
    var me = this;
    me.sensorsList = sensorsListArg || me.sensorsList;
    var doc = msg.getRegMsg(me.deviceId, undefined, undefined, me.sensorsList);
    if (!sensorsListArg) {
        // TODO: move this logic to the cloud message module
        me.logger.info("Changing message type...");
        doc.msg_type = "device_capability_registration_msg";
    }
    doc.deviceToken = me.secret.deviceToken;
    me.logger.debug("Reg doc: %j", doc, {});
    me.client.publish(buildPath(me.topics.device_metadata, me.deviceId), doc, me.pubArgs);
};
IoTKitCloud.prototype.metric = function(message){
    var me = this;
    var doc = msg.getMetricMsg(me.deviceId, me.secret.accountId, message);
    doc.deviceToken = me.secret.deviceToken;
    me.logger.debug("Metric doc: %j", doc, {});
    me.client.publish(buildPath(me.topics.metric_topic,
                                [me.secret.accountId, me.deviceId]),
                     doc, me.pubArgs);
};
IoTKitCloud.prototype.regComponent = function(sensorsListArg) {
    var me = this;
    me.sensorsList = sensorsListArg || me.sensorsList;
    var doc = msg.getRegCompoMsg(me.deviceId, undefined, undefined, me.sensorsList);
    if (!sensorsListArg) {
        // TODO: move this logic to the cloud message module
        me.logger.info("Changing message type...");
        doc.msg_type = "device_capability_registration_msg";
    }
    doc.deviceToken = me.secret.deviceToken;
    me.logger.debug("Reg doc: %j", doc, {});
    me.client.publish(buildPath(me.topics.device_component, me.deviceId), doc, me.pubArgs);
};


exports.init = function(conf, broker, logger, deviceId, sensorsStore) {
    return new IoTKitCloud(conf, broker, logger, deviceId, sensorsStore);
};