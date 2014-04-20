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

var mqtt = require('mqtt'),
    msg = require('./cloud-message').init();

/**
 * @description Build a path replacing patter {} by the data arguments
 * @param path string the represent a URL path
 * @param data Array or string
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


function IoTKitCloud(conf, logger, deviceId, sensorsStore){
    //TODO refactor as Gateway - Broker codes.
    var me = this;
    me.logger = logger;
    me.sensorsStore = sensorsStore;
    me.sensorsList = {};

    var host = conf.host || 'broker.enableiot.com';
    var port = conf.port || 8884;

    var args = {
         keyPath: conf.key || './certs/client.key',
         certPath: conf.crt || './certs/client.crt',
         keepalive: 59000
     };
    //TODO Make this config available at config optoin
    me.secured = false;

    me.deviceId = deviceId;
    me.activationCode = conf.activation_code;
    me.deviceToken = conf.device_token;
    me.apiKey = conf.apikey;
    me.accountId = "anon";
    me.pubArgs = {
        qos: conf.qos || 1,
        retain: conf.retain || true
    };
    me.logger.info("device id: ", me.deviceId);

    if (me.secured) {
        me.client = mqtt.createSecureClient(port, host, args);
    } else {
        me.client = mqtt.createClient(port, host);
    }



    me.logger.info('Cloud client created');

    me.topics = {
        reg: conf.reg_topic || '/server/registration',
        status: conf.status_topic || '/server/registration_status',
        metric: conf.metric_topic || '/server/metric/',
        device: conf.device || "DEVICE/{deviceid}",
        device_activation: conf.device_activation || "devices/{deviceid}/activation",
        device_metadata: conf.device_metadata ||"devices/{deviceid}/metadata",
        device_status: conf.device_status || "devices/{deviceid}/activation_status",
        metric_topic: conf.metric_topic || "server/metric/{accountid}/{deviceid}"

    };
    me.activationCompleted = false;
    me.client.subscribe(buildPath(me.topics.device_status, me.deviceId))
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
                //me.topics.metric = '/server/metric/' + me.accountId + '/' + me.deviceId;
                //me.sensorsStore.saveSensorsList(me.sensorsList);
                me.activationCompleted = true;
                me.logger.info('Devices activated successfully');
            }
        });


    me.activate = function (callback) {
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
                    callback(new Error("Missing token"));
                }
            } else {
                callback(null);
            }
        }
        waitForActivation();
    };
};
/*IoTKitCloud.prototype.act = function() {
 var me = this;
 var actMsg = {
 "activationCode": me.activationCode,
 "apiKey": me.apiKey
 }
 me.logger.debug("Activation message to be sent: ", actMsg);
 me.pub(buildPath(me.topics.device_activation,me.deviceId) , actMsg);
 };*/


IoTKitCloud.prototype.reg = function(sensorsListArg) {
    var me = this;
    me.sensorsList = sensorsListArg || me.sensorsList;
    var doc = msg.getRegMsg(me.deviceId, undefined, undefined, me.sensorsList);
    if (!sensorsListArg) {
        // TODO: move this logic to the cloud message module
        me.logger.info("Changing message type...");
        doc.msg_type = "device_capability_registration_msg";
        doc.device_token = me.deviceToken;
    }
    me.logger.debug("Reg doc: %j", doc, {});
    me.pub(buildPath(me.topics.device_metadata,me.deviceId) , doc);
};

IoTKitCloud.prototype.metric = function(message){
    var me = this;
    var doc = msg.getMetricMsg(me.deviceId, me.accountId, message);
    doc.device_token = me.deviceToken;
    me.logger.debug("Metric doc: %j", doc, {});
    me.pub(buildPath(me.topics.metric_topic,[me.accountId, me.deviceId]), doc);
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

exports.init = function(conf, logger, deviceId, sensorsStore) {
    return new IoTKitCloud(conf, logger, deviceId, sensorsStore);
};