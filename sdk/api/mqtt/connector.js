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
var mqtt = require('mqtt');
var trustedCAs = [__dirname + '/../../certs/AddTrust_External_Root.pem'];

function Broker(conf, logger) {
    var me = this;
    me.host = conf.host;
    me.port = conf.port;
    me.secure = conf.secure;
    me.keepalive = conf.keepalive || 60;
    me.crd = {
        username: conf.username || '',
        password: conf.password || ''
    };
    if(conf.strictSSL === undefined || conf.strictSSL === true) {
        me.crd.ca = trustedCAs;
        me.crd.rejectUnauthorized = true;
    }
    me.max_retries = conf.retries || 5;
    me.messageHandler = [];
    me.logger = logger;
    me.topics = conf.topics;
    me.pubArgs = {
        qos: conf.qos || 1,
        retain: conf.retain
    };
    me.client = {
        connected: false,
        end: function() {}
    };
    me.bindings = {};
    me.setCredential = function (newCrd) {
        me.crd = newCrd || me.crd;
        me.credential = {
            username: me.crd.username || '',
            password: me.crd.password || '',
            keepalive: me.keepalive
        };
        if(conf.strictSSL === undefined || conf.strictSSL === true) {
            me.credential.ca = trustedCAs;
            me.credential.rejectUnauthorized = true;
        }
    };
    me.setCredential();
    me.listen = function () {
        me.client.on('message',function(topic, message) {
            try {
                message = JSON.parse(message);
            } catch (e) {
                me.logger.error('Invalid Message: %s', e);
                return;
            }
            me.logger.info('STATUS: %s', topic, message);
            me.onMessage(topic, message);
        });
        me.client.on('connect', function() {
            me.logger.info('Connection to MQTT broker established.');
            for(var topic in me.bindings) {
                var handler = me.bindings[topic].handler;
                var callback = me.bindings[topic].callback;
                me.bind(topic, handler, callback);
            }
        });
        me.client.on('close', function() {
            me.client.connected = false;
            me.logger.error('Connection to MQTT broker is closed. Retrying...');
        });
    };
    me.connect = function (done) {
        var retries = 0;
        try {
            if ((me.client instanceof mqtt.MqttClient) === false) {
                if (me.secure === false) {
                    me.logger.info("Non Secure Connection to "+ me.host + ":" + me.port);
                    me.client = mqtt.createClient(me.port, me.host, me.credential).on('error', function(e) {
                        logger.warn("Error in connection: " + JSON.stringify(e));
                    });
                } else {
                    me.logger.info("Trying with Secure Connection to" + me.host + ":" + me.port);
                    me.logger.debug("with " + JSON.stringify(me.credential));
                    me.client = mqtt.createSecureClient(me.port, me.host, me.credential).on('error', function(e) {
                        logger.warn("Error in secure connection: " + JSON.stringify(e));
                    });
                }
            }
        } catch(e) {
            logger.error("Error in connection ex: " + JSON.stringify(e));
            done(new Error("Connection Error", 1002));
            return;
        }
        var counter = 20000;

        function waitForConnection() {
            if (!me.client.connected) {
                if(counter < 18000) {
                    counter += 100;
                    setTimeout(waitForConnection, 100);
                    return false;
                } else {
                    retries++;
                    me.logger.info("Waiting for MQTTConnector to connect # " + retries);
                    if (retries < me.max_retries) {
                        counter = 0;
                        setTimeout(waitForConnection, 100);
                    } else {
                        me.logger.info('MQTTConnector: Error Connecting to ' + me.host + ':' + me.port);
                        done(new Error("Connection Error", 1001));
                    }
                    return false;
                }
            }
            me.logger.info('MQTTConnector: Connection successful to ' + me.host + ':' + me.port);
            me.listen();
            done(null);
            return true;
        }
        waitForConnection();
    };
    me.disconnect = function () {
        me.logger.info("Trying to disconnect ");
        me.client.end();
        me.client = {
            connected: false,
            end: function() {}
        };
    };
    me.attach = function (topic, handler) {
        me.dettach(topic);
        me.messageHandler.push({"t": topic, "h": handler});
    };
    function tryPattern(pattern, text) {
        var a = new RegExp(pattern);
        return a.test(text);
    }
    me.dettach = function (topic) {
        me.messageHandler = me.messageHandler.filter(function (obj) {
            return !tryPattern(obj.t, topic);
        });
    };
    me.onMessage = function (topic, message) {
        var i,
            length = me.messageHandler.length;
        /**
         * Iterate over the messageHandler to match topic patter,
         * and dispatch message to only proper handler
         */
        for (i = 0; i < length; i++ ) {
            var obj = me.messageHandler[i];
            if (tryPattern(obj.t, topic)) {
                me.logger.info('Fired STATUS: %s' + topic + JSON.stringify(message));
                obj.h(topic, message);
            }
        }
    };
    me.bind = function (topic, handler, callback) {
        /**
         * since the bind and publish connect automatically,
         * it is require to chain the callbacks
         */
        me.bindings[topic] = {
            handler: handler,
            callback: callback
        };
        var toCallBack = callback;
        function connectCallback() {
            me.logger.debug('Subscribing to: ' + topic);
            me.client.subscribe(topic, function (err, granted) {
                me.logger.debug("grant " + granted);
                var topicAsPattern = granted[0].topic.replace(/\+/g, "[^<>]*");
                me.logger.debug("grant " + topicAsPattern);
                me.attach(topicAsPattern, handler);
                if (toCallBack) {
                    toCallBack();
                }
            });
        }
        if (!me.connected()) {
            me.connect(function(err) {
                if (!err) {
                    connectCallback();
                } else {

                    me.logger.error(err);
                    if (toCallBack) {
                        toCallBack(err);
                    }
                }
            });
        } else {
            connectCallback();
        }
    };
    me.unbind = function (topic, callback) {
        delete me.bindings[topic];
        me.logger.debug('Unbinding from Topic : T => '+ topic);
        me.client.unsubscribe(topic, function() {
            me.logger.debug('Unbound from Topic : T => '+ topic);
            me.dettach(topic);
            if (callback) {
                callback();
            }
        });
    };
    /**
     * @description publish broadcast to an specifics topics, the message.
     * @param topic <string> to which will be broadcast the message.
     * @param message <object> that will be sent to topics
     * @param args <object>
     */
    me.publish = function (topic, message, options, callback) {
        if ("function" === typeof options) {
            callback = options;
            options = me.pubArgs;
        } else {
            options = options || me.pubArgs;
        }
        function publishCallback() {
            me.logger.debug('Publishing : T => ' + topic + " MSG => " + JSON.stringify(message));
            me.client.publish(topic, JSON.stringify(message), options, callback);
        }
        if (!me.connected()) {
            me.connect(function(err) {
                if (!err) {
                    publishCallback();
                } else {
                    me.logger.error(err);
                    if (callback) {
                        callback(err);
                    }
                }
            });
        } else {
            publishCallback();
        }
    };
    me.connected = function () {
        return me.client.connected;
    };
}
var broker = null;
module.exports.singleton = function (conf, logger) {
    if (!broker) {
        broker = new Broker(conf, logger);
    }
    return broker;
};
module.exports.Broker = Broker;
