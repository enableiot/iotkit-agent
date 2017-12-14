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
var common = require('../common'),
    Broker = require("../../api/mqtt/connector");

function IoTKitMQTTCloud(conf, logger, broker) {
    var me = this;
    me.logger = logger;
    me.client = broker;
    me.type = 'mqtt';
    me.topics = conf.connector[me.type].topic;
    me.pubArgs = {
        qos: 1,
        retain: false
    };
    me.logger.debug('MQTT Proxy Created');
}

IoTKitMQTTCloud.prototype.activationResponse = function (data, callback, syncCallback) {
    var me = this;
    var activationTopicStatus = common.buildPath(me.topics.device_status, data.deviceId);
    var handler = function (topic, message) {
        me.logger.debug('Topic %s , Message Recv : %s', topic, message);
        var secret = {
            deviceToken: null,
            accountId: null,
            deviceId: data.deviceId
        };
        if (message && message.status === 1) {
            secret.deviceToken = message.deviceToken;
            secret.accountId = message.accountId;
            secret.status = 0;
            me.logger.debug('Activation Response { ', secret.deviceId , '} --> Success');
        } else {
            if (message) {
                me.logger.error('Activation Rejected: { ', message, '} --> error ');
            }
            secret = new Error("Activation Rejected");
            secret.status = 300;
        }
        me.client.unbind(activationTopicStatus);
        callback(secret);
    };
    me.client.bind(activationTopicStatus, handler, syncCallback);
};

/**
 * It will send activation message {activation code} and waiting for device status topic
 * in which it will be received the activation or not of the token.
 * @data {deviceId, code}
 * @param callback
 */
IoTKitMQTTCloud.prototype.activation = function (data, callback) {
    var me = this;
    me.logger.debug('Called activate function');
    me.logger.debug('...trying activation');
    var actResData = {
        deviceId: data.deviceId
    };
    /* First, it is subscribe to mqtt topic response,
    * in order to be prepared for the activation response
    */
    me.activationResponse(actResData, callback, function () {
        var activationMsg = {
            "activationCode": data.code
        };
        var args = {
            qos : 1,
            retain: false
        };
        me.logger.debug('Sending Activation Code');
        me.client.publish(common.buildPath(me.topics.device_activation, data.deviceId), activationMsg, args);
    });
};

IoTKitMQTTCloud.prototype.componentResponse = function (device, callback, syncCallback) {
    var me = this;
    var componentStatus = common.buildPath(me.topics.device_component_status, device);
    var handler = function (topic, message) {
        me.client.unbind(componentStatus);
        var comp = {};
        if (message && message.status === 1) {
            me.logger.info('Topic %s , Message Recv : %s', topic, message);
            comp = message.data[0];
            comp.status = 0;
        } else {
            me.logger.error('Topic %s , Message Recv : %s', topic, message);
            comp = new Error ("Component Registration Failed");
            comp.status = 3001;
        }
        if (callback) {
            callback(comp);
        }
        return true;
    };
    return me.client.bind(componentStatus, handler, syncCallback);
};

IoTKitMQTTCloud.prototype.addComponent = function (data, callback) {
    var me = this;
    me.logger.debug("RegComponent doc: %j", data, {});
    return me.componentResponse (data.deviceId, callback, function(err) {
        if(!err) {
            var topic = common.buildPath(me.topics.device_component_add, data.deviceId);
            delete data.deviceId;
            me.client.publish(topic, data, me.pubArgs);
        } else {
            var  comp = new Error ("Not Connection");
            comp.status = 3002;
            if (callback) {
                callback(comp);
            }
        }
        return true;
    });
};

IoTKitMQTTCloud.prototype.pullActuations = function (data, callback) {
    var me = this;
    me.logger.error("Actuations pulling is not yet supported by MQTT protocol");
    callback(null);
};

IoTKitMQTTCloud.prototype.data = function (data, callback) {
    var me = this;
    delete data.deviceToken;
    var topic = common.buildPath(me.topics.metric_topic, [data.accountId, data.did]);
    me.logger.debug("Metric doc: %j", data, {});
    delete data.gatewayId;
    return me.client.publish(topic, data.convertToMQTTPayload(), me.pubArgs, function() {
        return callback({status:0});
    });
};

IoTKitMQTTCloud.prototype.attributes = function (data, callback) {
    var me = this;
    me.logger.debug("Reg doc: %j", data, {});
    var topic = common.buildPath(me.topics.device_metadata, data.deviceId);
    delete data.deviceId;
    return me.client.publish(topic, data, me.pubArgs, callback);
};

IoTKitMQTTCloud.prototype.disconnect = function () {
    var me = this;
    me.client.disconnect();
};

IoTKitMQTTCloud.prototype.getCatalogResponse = function (device, callback, syncCallback) {
    var me = this;
    var catalogStatus = common.buildPath(me.topics.cmpcatalog_status, device);
    var handler = function (topic, message) {
        me.logger.debug('Topic %s , Message Recv : %s', topic, message);
        me.client.unbind(catalogStatus);
        callback(message);
    };
    me.client.bind(catalogStatus, handler, syncCallback);
};

IoTKitMQTTCloud.prototype.getCatalog = function (data, callback) {
    var me = this;
    me.logger.info("Getting Component Getting");
    me.getCatalogResponse(data.deviceId, callback, function (err) {
        if (!err) {
            var topic = common.buildPath(me.topics.cmpcatalog, data.deviceId);
            me.client.publish(topic, data, me.pubArgs);
        } else {
            callback();
        }
    });
};

IoTKitMQTTCloud.prototype.healthResponse = function (device, callback, syncCallback) {
    var me = this;
    var healthStatus = common.buildPath(me.topics.health_status, device);
    var handler = function (topic, message) {
        me.logger.debug('Topic %s , Message Recv : %s', topic, message);
        me.client.unbind(healthStatus);
        callback(message);
    };
    me.client.bind(healthStatus, handler, syncCallback);
} ;

IoTKitMQTTCloud.prototype.health = function (device, callback) {
    var me = this;
    me.logger.info("Starting Health testing ");
    me.healthResponse(device, callback, function (err) {
        if (!err) {
            var topic = common.buildPath(me.topics.health, device);
            var data = { 'detail': 'mqtt'};
            me.client.publish(topic, data, me.pubArgs);
        } else {
            callback();
        }

    });

};

IoTKitMQTTCloud.prototype.setCredential = function (user, password) {
    var me = this;
    me.crd = {
        username: user || '',
        password: password || ''
    };

    me.client.setCredential(me.crd);
};
IoTKitMQTTCloud.prototype.getActualTime = function (callback) {
    var me = this;
    me.logger.error('This option is not currently supported for MQTT protocol.');
    callback(null);
};

module.exports.init = function(conf, logger) {
    var brokerConnector = Broker.singleton(conf.connector.mqtt, logger);
    return new IoTKitMQTTCloud(conf, logger, brokerConnector);
};
