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

var logger = require('../lib/logger').init(),
    Cloud = require("../lib/cloud.proxy"),
    utils = require("../lib/utils").init(),
    common = require("../lib/common"),
    configurator = require('../admin/configurator'),
    config = require('../config'),
    Websocket = require('@open-iot-service-platform/oisp-sdk-js')(config).api.ws.connector,
    wsErrors = require('@open-iot-service-platform/oisp-sdk-js')(config).api.ws.errors,
    exec = require('child_process').exec,
    exitMessageCode = {
        "OK": 0,
        "ERROR": 1
    };

var activate = function (code) {
    logger.debug("Activation started ...");
    utils.getDeviceId(function (id) {
        var cloud = Cloud.init(logger, id);
        cloud.activate(code, function (err) {
            var exitCode = exitMessageCode.OK;
            cloud.disconnect();
            if (err) {
                logger.error("Error in the activation process ...", err);
                exitCode = exitMessageCode.ERROR;
            } else{
                configurator.setDeviceId(id);
            }
            process.exit(exitCode);
        });
    });
};

function testConnection () {
    var host;
    if(config.default_connector === 'rest+ws') {
        host = config.connector['rest'].host;
    } else {
        host = config.connector[config.default_connector].host;
    }
    utils.getDeviceId(function (id) {
        var cloud = Cloud.init(logger, id);
        cloud.test(function (res) {
            var exitCode = exitMessageCode.OK;
            if (res) {
                logger.info("Connected to %s", host);
                logger.info("Environment: %s", res.currentSetting);
                logger.info("Build: %s", res.build);
                logger.debug("Full response %j", res );
                if (res.mqtt === 1) {
                    logger.info("MQTT ok")
                } else {
                    logger.warn("MQTT failed or not configured");
                }
            } else {
                logger.error("Connection failed to %s", host);
                exitCode = exitMessageCode.ERROR;
            }
            if(config.default_connector === 'rest+ws') {
                var deviceInfo = common.getDeviceConfig();
                var WS = Websocket.singleton(config, deviceInfo);
                WS.client.on('connect', function(connection) {
                    connection.on('close', function(reasonCode, description) {
                        logger.info('Websocket connection closed. Reason: ' + reasonCode + ' ' + description);
                        process.exit(exitCode);
                    });
                    connection.on('message', function(message) {
                        var messageObject;
                        try {
                            messageObject = JSON.parse(message.utf8Data);
                        } catch (err) {
                            logger.error('Received unexpected message from WS server: ' + message.utf8Data);
                            exitCode = exitMessageCode.ERROR;
                        }
                        if (messageObject.code === wsErrors.Success.ReceivedPong.code) {
                            logger.info('Connection to Web Socket Server successful');
                            connection.close();
                        }
                    });
                    var pingMessageObject = {
                        "type": "ping"
                    };
                    connection.sendUTF(JSON.stringify(pingMessageObject));
                });
                logger.info("Trying to connect to WS server ...");
                WS.connect();
                setTimeout(function() {
                    logger.error("Timeout exceeded. Program will exit.");
                    process.exit(exitCode);
                }, config.connector.ws.testTimeout);
            }

        });
    });
}

function setActualTime () {
    utils.getDeviceId(function (id) {
        var cloud = Cloud.init(logger, id);
        cloud.getActualTime(function (time) {
            var exitCode = exitMessageCode.OK;
            if (time) {
                var command = 'date -u "' + time + '"';
                exec(command, function (error, stdout, stderr) {
                    if (error) {
                        logger.error("Error changing data: ", stderr);
                        logger.debug("Date error: ", error);
                        exitCode = exitMessageCode.ERROR;
                    } else {
                        logger.info("UTC time changed for: ", stdout);
                    }
                    process.exit(exitCode);
                });
            } else {
                logger.error("Failed to receive actual time");
                exitCode = exitMessageCode.ERROR;
                process.exit(exitCode);
            }
        });
    });
}

module.exports = {
    addCommand : function (program) {
        program
            .command('test')
            .description('Tries to reach the server (using the current protocol).')
            .action(function() {
                testConnection();
            });

        program
            .command('activate <activation_code>')
            .description('Activates the device.')
            .action(activate);

        program
            .command('set-time')
            .description('Sets actual UTC time on your device.')
            .action(function() {
                setActualTime();
            });
    }
};
