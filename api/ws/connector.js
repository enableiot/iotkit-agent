/*
 Copyright (c) 2015, Intel Corporation

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
var WebSocketClient = require('websocket').client,
    tunnel = require('tunnel'),
    common = require('../../lib/common'),
    deviceInfo = require(common.getFileFromDataDirectory('device.json').split('.json')[0]);

function Websockets(conf, logger) {
    var me = this;
    me.host = conf.connector.ws.host;
    me.port = conf.connector.ws.port;
    me.secure = conf.connector.ws.secure;
    me.retryTime = conf.connector.ws.retryTime;
    me.proxy = conf.connector.ws.proxy;
    me.client =  new WebSocketClient();
    me.logger = logger;
    me.bindings = {};

    if(me.proxy.host && me.proxy.port) {
        if(conf.connector.ws.proxy.host.substr(0,5) === 'https') {
            me.proxy.tunnelingAgent = tunnel.httpsOverHttps({
                proxy: {
                    host: conf.connector.ws.proxy.host.split('https://')[1],
                    port: conf.connector.ws.proxy.port
                }
            });
        } else {
            me.proxy.tunnelingAgent = tunnel.httpsOverHttp({
                proxy: {
                    host: conf.connector.ws.proxy.host.split('http://')[1] || conf.connector.ws.proxy.host,
                    port: conf.connector.ws.proxy.port
                }
            });
        }
    }

    me.client.requestOptions = {
        agent: me.proxy.tunnelingAgent
    };

    me.connect = function() {
        if(me.secure) {
            me.client.connect('wss://' + conf.connector.ws.host + ':' + conf.connector.ws.port, 'echo-protocol', null, null, me.client.requestOptions);
        } else {
            me.client.connect('ws://' + conf.connector.ws.host + ':' + conf.connector.ws.port, 'echo-protocol', null, null, me.client.requestOptions);
        }
    };

    me.reconnect = function() {
        me.logger.info("Trying to reconnect...");
        me.connect();
    };

    me.onMessage = function(message) {
        try {
            me.bindings.handler(JSON.parse(message));
        } catch (err) {
            me.logger.error("Received error message: " + message);
        }
    };

    me.listen = function() {
        me.client.on('connect', function(connection){
            logger.info('WSConnector: Connection successful to: ' + conf.connector.ws.host + ':' + conf.connector.ws.port);
            var initMessageObject = {
                "type": "device",
                "deviceId": deviceInfo.device_id,
                "deviceToken": deviceInfo.device_token
            };
            connection.sendUTF(JSON.stringify(initMessageObject));
            connection.on('close', function() {
                me.logger.info("Websocket connection closed.");
                me.reconnect();
            });
            connection.on('message', function(message) {
                me.logger.info('Fired STATUS: ', message.utf8Data);
                me.onMessage(message.utf8Data);
            });
        });
    };

    me.client.on('connectFailed', function(error) {
        me.logger.error("Websocket cannot connect. " + error);
        setTimeout(function() {
            me.reconnect();
        }, parseInt(me.retryTime));
    });

    me.bind = function (topic, handler, callback) {
        me.bindings = {
            handler: handler,
            callback: callback
        };
        logger.info('Connecting to ' + conf.connector.ws.host + ':' + conf.connector.ws.port + '...');
        me.connect();
        me.listen();
    };
}

var websocket = null;
module.exports.singleton = function (conf, logger) {
    if (!websocket) {
        websocket = new Websockets(conf, logger);
    }
    return websocket;
};
module.exports.Websockets = Websockets;