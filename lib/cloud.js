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
var msg = require('./cloud-message'),
    common = require('./common'),
    path = require("path");

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
function IoTKitCloud(conf, broker, logger, deviceId){
    var me = this;
    me.logger = logger;
    me.filename = conf.token_file || "token.json";
    me.fullFilename = path.join(__dirname, '../certs/' +  me.filename);
    me.secret = common.readFileToJson(me.fullFilename);
    me.client = broker;
    me.retries = 0;
    me.max_retries = conf.activation_retries || 10;
    me.deviceId = deviceId;
    me.gatewayId = conf.gateway_id || deviceId;
    me.activationCode = conf.activation_code;
    me.apiKey = conf.api_key;
    me.topics = {
        device: conf.device || "devices/{deviceid}",
        device_activation: conf.device_activation || "devices/{deviceid}/activation",
        device_metadata: conf.device_metadata ||"devices/{deviceid}/metadata",
        device_status: conf.device_status || "devices/{deviceid}/activation_status",
        metric_topic: conf.metric_topic || "server/metric/{accountid}/{gatewayid}",
        device_component_add: conf.device_components_add || "devices/{deviceid}/components/add",
        device_component_del: conf.device_components_del || "devices/{deviceid}/components/del"
    };
    me.pubArgs = {
        qos: 1,
        retain: false
    };
    me.logger.info('Cloud client created');
}
IoTKitCloud.prototype.isActivated = function () {
    var me = this;
    var token = me.secret.deviceToken;
    var account = me.secret.accountId;
    if (token && token.length > 600) {
        if (account && account.length > 30) {
            return true;
        }
    }
    return false;
};
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
               common.writeToJson(me.fullFilename, me.secret);
           } else {
               me.logger.error('Activation Rejected: %s');
               me.retries = me.max_retries;
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
    function activationComplete(){
        /**
         * It were sent ever activation the update Metadata, since every start/stop the HW could change.
         */
        me.update();
        callback(null);
    }

    function waitingForActivationStatus() {
        me.logger.debug('Entering waitingForActivationStatus...');
        if (!me.isActivated()) {
            me.retries ++;
            if (me.retries < me.max_retries) {
                setTimeout(waitingForActivationStatus, 1000);
            } else {
                callback(new Error("The Activation token has not received"));
            }
        } else {
            me.logger.debug('Device is active...');
            me.client.unbind(tokenTopic);
            activationComplete();
        }
    }
    if (!me.isActivated()) {
        me.logger.debug('Device is NOT active...trying activation');
        var tokenTopic = buildPath(me.topics.device_status, me.deviceId);
        me.client.bind(tokenTopic, me.waitForToken());
        me.sendActivationCode();
        me.retries = 0;
        waitingForActivationStatus();
    } else {
        activationComplete();
    }
};

IoTKitCloud.prototype.update = function() {
    var me = this;
    var doc = new msg.Metadata(me.gatewayId);
    doc.deviceToken = me.secret.deviceToken;
    me.logger.debug("Reg doc: %j", doc, {});
    me.client.publish(buildPath(me.topics.device_metadata, me.deviceId), doc, me.pubArgs);
};
IoTKitCloud.prototype.dataSubmit = function (metric) {
    var me = this;
    var doc = metric;
    doc.accountId = me.secret.accountId;
    doc.did = me.deviceId;
    //TODO the device token is remove by not be compatible with the current AA interface (MQTT)
    //doc.deviceToken = me.secret.deviceToken;
    me.logger.debug("Metric doc: %j", doc, {});
    me.client.publish(buildPath(me.topics.metric_topic, [me.secret.accountId, me.gatewayId]),
                      doc, me.pubArgs);


};

IoTKitCloud.prototype.regComponent = function(comp) {
    var me = this;
    var doc = JSON.parse(JSON.stringify(comp)); //HardCopy to remove reference bind
    doc.deviceToken = me.secret.deviceToken;
    me.logger.debug("RegComponent doc: %j", doc, {});
    me.client.publish(buildPath(me.topics.device_component_add, me.deviceId),
                      doc,
                      me.pubArgs);
};
IoTKitCloud.prototype.desRegComponent = function(comp) {
    var me = this;
    var doc =  JSON.parse(JSON.stringify(comp)); //HardCopy to remove reference bind
    doc.deviceToken = me.secret.deviceToken;
    me.logger.debug("DesReg Component doc: %j", doc, {});
    me.client.publish(buildPath(me.topics.device_component_del, me.deviceId),
                                doc,
                                me.pubArgs);
};


exports.init = function(conf, broker, logger, deviceId) {
    return new IoTKitCloud(conf, broker, logger, deviceId);
};