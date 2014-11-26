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

var mqtt = require('mqtt'),
    fs = require('fs'),
    common = require('../lib/common'),
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

exports.init = function(conf, logger, onMessage, deviceId) {

  var mqttServerPort = conf.listeners.mqtt_port || 1883;

  var filename = conf.token_file || "token.json";
  var fullFilename = path.join(__dirname, '../data/' +  filename);
  var secret = { };
    if (fs.existsSync(fullFilename)) {
        secret = common.readFileToJson(fullFilename);
    } else {
        //consider from system folder /usr/share/iotkit-agent/certs
        fullFilename = '/usr/share/iotkit-agent/data/' +  filename;
        secret = common.readFileToJson(fullFilename);
    }

  var metric_topic = conf.connector.mqtt.topic.metric_topic || "server/metric/{accountid}/{gatewayid}";

    var tlsArgs = { };
    var verifyCertKeyPath = conf.connector.mqtt.key || './certs/client.key';
    if (fs.existsSync(verifyCertKeyPath)) {
        tlsArgs = {
            keyPath: conf.connector.mqtt.key || './certs/client.key',
            certPath: conf.connector.mqtt.crt || './certs/client.crt',
            keepalive: 59000
        };
    } else {
        // load from /usr/share
        tlsArgs = {
            keyPath: '/usr/share/iotkit-agent/certs/enableiot_agent.key',
            certPath: '/usr/share/iotkit-agent/certs/enableiot_agent.crt',
            keepalive: 59000
        };
    }

  var mqttServer = mqtt.createServer(function(client) {

    client.on('connect', function(packet) {
      client.connack({returnCode: 0});
      client.id = packet.clientId;
      logger.debug('MQTT Client connected: ', packet.clientId);
    });

    client.on('publish', function(packet) {
      logger.debug('MQTT Topic: %s Payload: %s', packet.topic, packet.payload);
      try {
        onMessage(JSON.parse(packet.payload));
      } catch (ex) {
        logger.error('MQTT Error on message: %s', ex);
      }
  });

    client.on('subscribe', function(packet) {
        try {
            // create a new client object to the new online broker
            // subscribe

            var newclient;
            var topic = packet.subscriptions[0].topic;

            if(conf.connector.mqtt.secure){
                newclient = mqtt.createSecureClient(conf.connector.mqtt.port, conf.connector.mqtt.host, tlsArgs);
            } else {
                newclient = mqtt.createClient(conf.connector.mqtt.port, conf.connector.mqtt.host);
            }

            if(topic === 'data'){
                newclient.subscribe(buildPath(metric_topic, [secret.accountId, deviceId]));
                logger.info('Subscribed to topic:' + buildPath(metric_topic, [secret.accountId, deviceId]));
            } else {
                newclient.subscribe(buildPath(metric_topic, [secret.accountId, deviceId]) + '/' + topic);
                logger.info('Subscribing to topic:' + buildPath(metric_topic, [secret.accountId, deviceId]) + '/' + topic);
            }

            newclient.on('message', function (topic, message) {
                logger.info('Received a message on subscribed topic: ' + topic);
                client.publish({"topic": topic, "payload": message});
            });
        } catch (ex) {
            logger.error('Error on message: %s', ex.message);
            logger.error(ex.stack);
        }
    });

    client.on('pingreq', function() {
      client.pingresp();
    });

    client.on('disconnect', function() {
      client.stream.end();
    });

    client.on('error', function(err) {
      //client.stream.end();
      logger.error('MQTT Error: ', err);
    });

  }).listen(mqttServerPort);

  logger.info("MQTT listener started on port: ", mqttServerPort);

  return mqttServer;

};


