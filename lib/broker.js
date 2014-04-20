/*
 Copyright (c) 2014, Intel Corporation

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
var mqtt = require('mqtt');

module.exports = function Broker(conf, logger) {
    var me = this;
    me.host = conf.host || 'broker.enableiot.com';
    me.port = conf.port || 8884;
    me.args = {
        keyPath: conf.key || './certs/client.key',
        certPath: conf.crt || './certs/client.crt',
        keepalive: 59000
    };
    me.max_retries = conf.retries;

    me.logger = logger;
    me.topics = conf.topics;
    me.pubArgs = {
        qos: conf.qos || 1,
        retain: conf.retain || true
    };
    me.connect = function(done) {
        var retries = 0;
        try {
           if (conf.secure) {
               me.logger.debug("Trying with Secure Connection to", me.host, ":", me.port, "with ", me.args);
               me.client = mqtt.createSecureClient(me.port, me.host, me.args);
           }
           else {
               me.logger.debug("None Secure Connection to ", me.host, ":", me.port);
               me.client = mqtt.createClient(me.port, me.host);
           }
        } catch(e) {
           done(new Error("Connection Error", 1002));
           return;
        }
        function waitForConnection() {
            if (!me.client.connected) {
                retries++;
                me.logger.debug("Waiting # ", retries);
                if (retries < me.max_retries) {
                    setTimeout(waitForConnection, 500);
                } else {
                    me.logger.info('Broker Connector: Error Connecting to ', me.host, ':', me.port);
                    done(new Error("Connection Error", 1001));
                }
                return false;
            }
            me.logger.info('Broker Connector: Connection successful to ', me.host, ':', me.port);
            done(null);
            return true;
        }
        waitForConnection();
    };
    me.bind = function(topic, handler) {
        me.logger.debug('Suscribing to: ', topic);
        me.client.subscribe(topic).on('message',function(topic, message) {
            try {
                message = JSON.parse(message);
            } catch (e){
                me.logger.error('Invalid Message: %s', e);
                return;
            }
            me.logger.info('STATUS: %s', topic, message);
            handler(topic, message);
        });
    };
    me.publish = function(topic, message, args) {
        var me = this;
        // Validate the input arg
        if (!message || !topic) {
            logger.error('send: null args');
            return;
        }
        me.logger.debug('Publishing : T => ', topic, " MSG => ", message);
        me.client.publish(topic, JSON.stringify(message), args);
    };
    me.connected = function () {
        return me.client.connected;
    };
};