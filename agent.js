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
var utils = require("./lib/utils").init(),
    logger = require("./lib/logger").init(),
    Message = require('./lib/agent-message'),
    Broker = require("./lib/mqtt-connector/connector"),
    Listener = require("./listeners/"),
    conf = require('./config');


process.on("uncaughtException", function(err) {
    logger.error("UncaughtException:", err.message);
    logger.error(err.stack);
    // let the process exit so that forever can restart it
    process.exit(1);
});

utils.getDeviceId(function (id) {
    logger.info("IoT Kit Cloud Agent: ", id);
    // configure sensor store
    var brokerConnector = new Broker(conf.broker, logger);
    brokerConnector.connect(function(err) {
        if (!err) {
            var cloud = require("./lib/cloud").init(conf, brokerConnector, logger, id);
            cloud.activate(function (err) {
                if (!err) {
                    var agentMessage = Message.init(cloud, logger);
                    logger.info("Starting listeners...");
                    Listener.REST.init(conf, logger, agentMessage.handler);
                    Listener.UDP.init(conf, logger, agentMessage.handler);
                    Listener.TCP.init(conf, logger, agentMessage.handler);
                    Listener.MQTT.init(conf, logger, agentMessage.handler);
                } else {
                    logger.error("Error in activation...", err);
                }
            });
        } else {
            logger.error("Connector Fail to connect...", err);
        }
    });
});


