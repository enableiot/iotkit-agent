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

var logger = require("@open-iot-service-platform/oisp-sdk-js").lib.logger.init(),
    common = require('../lib/common'),
    utils = require("../lib/utils").init(),
    path = require('path'),
    fs = require('fs');

var configFileKey = {
    dataDirectory: 'data_directory',
    userConfigDirectory : 'user_config_directory',
    defaultConnector: 'default_connector',
    loggerLevel: 'logger.LEVEL',
    connectorRestProxyHost: 'connector.rest.proxy.host',
    connectorRestProxyPort: 'connector.rest.proxy.port',
    connectorWsProxyHost: 'connector.ws.proxy.host',
    connectorWsProxyPort: 'connector.ws.proxy.port',
    udpListenerPort: 'listeners.udp_port',
    activationCode: 'activation_code',
    accountId : 'account_id',
    gatewayId : 'gateway_id',
    deviceId: 'device_id',
    deviceName: 'device_name',
    deviceToken: 'device_token',
    sensorList: 'sensor_list',
    lastActuationsPull: 'last_actuations_pull_time'
};

var setHostFor = function (host_value, port_value) {
    var data = common.getConfig();
    var proxy;
    if (data) {
        proxy = data["default_connector"];
        if(proxy === "rest+ws") {
            proxy = "ws";
        }

        logger.info("Config Key : ", proxy, " value ", host_value);
        var host_key = 'connector.' + proxy + '.host';

        if(proxy === "rest") {
            var protocol;
            var protocol_key = 'connector.' + proxy + '.protocol';
            if(host_value.indexOf("https://")===0) {
                host_value = host_value.replace("https://", "");
                protocol = "https";
            }else if(host_value.indexOf("http://")===0) {
                host_value = host_value.replace("http://", "");
                protocol = "http";
            }
            if(protocol) {
                common.saveToUserConfig(protocol_key, protocol);
            }
        }
        common.saveToUserConfig(host_key, host_value);
        if (port_value) {
            var port_key = 'connector.' + proxy + '.port';
            common.saveToUserConfig(port_key, port_value);
        }
    }
};

var consts = {
    PORT_MIN_VALUE: 0,
    PORT_MAX_VALUE: 65535
};

var portValidator = {
    'Port value must be an integer': function(value) {
        return !isNaN(value) && value % 1 === 0;
    },
    'Port value out of valid range': function(value) {
        return value >= consts.PORT_MIN_VALUE && value <= consts.PORT_MAX_VALUE;
    }
};

var setProxy = function (host_proxy, port_proxy, onProxyPortSet) {
    var err;
    for (var key in portValidator) {
        if (portValidator.hasOwnProperty(key) && !portValidator[key](port_proxy)) {
            err = key;
        }
    }

    if (!err) {
        common.saveToUserConfig(configFileKey.connectorRestProxyHost, host_proxy);
        common.saveToUserConfig(configFileKey.connectorRestProxyPort, parseInt(port_proxy));
        common.saveToUserConfig(configFileKey.connectorWsProxyHost, host_proxy);
        common.saveToUserConfig(configFileKey.connectorWsProxyPort, parseInt(port_proxy));
    }

    onProxyPortSet(port_proxy, err);
};

var resetProxy = function () {
    common.saveToUserConfig(configFileKey.connectorRestProxyHost, false);
    common.saveToUserConfig(configFileKey.connectorRestProxyPort, false);
    common.saveToUserConfig(configFileKey.connectorWsProxyHost, false);
    common.saveToUserConfig(configFileKey.connectorWsProxyPort, false);
    logger.info("Set Proxy data");
};

var setGatewayId = function(id, cb) {
    common.saveToDeviceConfig(configFileKey.gatewayId, id);
    cb(id);
};

var setDeviceId = function(id) {
    common.saveToDeviceConfig(configFileKey.deviceId, id);
};

var setLastActuationsPullTime = function(time) {
    common.saveToDeviceConfig(configFileKey.lastActuationsPull, time);
};

var getLastActuationsPullTime = function(cb) {
    cb(utils.getValueFromDeviceConfig(configFileKey.lastActuationsPull));
};

var getGatewayId = function(cb) {
    utils.getGatewayId(configFileKey.gatewayId, cb);
};

var getDataDirectory = function(cb) {
    utils.getDataDirectory(configFileKey.dataDirectory, cb);
};

var setListenerUdpPort = function(udp_port, onUdpPortSet) {
    logger.info("Set UDP port");

    var err;
    for(var key in portValidator) {
        if(portValidator.hasOwnProperty(key) &&
            !portValidator[key](udp_port)) {
            err = key;
        }
    }

    if(!err) {
        common.saveToUserConfig(configFileKey.udpListenerPort, parseInt(udp_port));
    }

    onUdpPortSet(udp_port, err);
};

var moveDataDirectory = function(directory, cb) {
    fs.exists(directory, function (exists) {
        if (!exists) {
            fs.mkdir(directory, function (err) {
                if (err) {
                    cb(err);
                    return;
                }
            });
        }

        var err;
        var config = common.getConfig();
        var directoryPath = path.resolve(__dirname, "..", config[configFileKey.dataDirectory]);

        var files = fs.readdirSync(directoryPath);
        try {
            files.forEach(function (file) {
                fs.writeFileSync(path.join(directory, file), fs.readFileSync(path.join(directoryPath, file)));
            });

            if (fs.readdirSync(directoryPath).length !== fs.readdirSync(directory).length) {
                fs.rmdirSync(directory);
            } else {
                directory = path.resolve(directory);
                common.saveToGlobalConfig(configFileKey.dataDirectory, directory);
            }
        } catch (e) {
            err = e;
        }

        var pathToDelete = (err) ? directory : directoryPath;

        try {
            var filesToDelete = fs.readdirSync(pathToDelete);
            filesToDelete.forEach(function (file) {
                fs.unlinkSync(path.resolve(pathToDelete, file));
            });

            if(err) {
                fs.rmdirSync(directory);
            }
        } catch (e) {
            console.log(e);
        }

        cb(err);
    });
};

var setDataDirectory = function(directory, cb) {
    fs.exists(directory, function (exists) {
        if(exists) {
            fs.exists(path.resolve(directory, "device.json"), function(configExists) {
                if(configExists) {
                    common.saveToGlobalConfig(configFileKey.dataDirectory, path.resolve(directory));
                } else{
                    cb(new Error("Directory does not contain device.json"));
                }
            });
        } else{
            cb(new Error("Data directory does not exist"));
        }
    });
};

var setDeviceName = function(name, cb) {
    common.saveToDeviceConfig(configFileKey.deviceName, name);
    cb(name);
};

var loggerLevel = {
    info: true,
    warn: true,
    error: true,
    debug: true
};
/*istanbul ignore next*/
module.exports = {
    addCommand : function (program) {
        program
            .command('protocol <protocol>')
            .description('Set the protocol to \'mqtt\' or \'rest\' or \'rest+ws\'')
            .action(function(protocol) {
                if (protocol === 'mqtt' || protocol === 'rest' || protocol === 'rest+ws') {
                    common.saveToUserConfig(configFileKey.defaultConnector, protocol);
                    logger.info("protocol set to: " + protocol);
                } else {
                    logger.error("invalid protocol: %s - please use 'mqtt' or 'rest' or 'rest+ws'", protocol);
                    // do not clear the previous protocol
                }
            });

        program
            .command('host <host> [<port>]')
            .description('Sets the cloud hostname for the current protocol.')
            .action(setHostFor);

        program
            .command('device-id')
            .description('Displays the device id.')
            .action(function() {
                utils.getDeviceId(function (id) {
                    logger.info("Device ID: %s", id);
                });
            });

        program
            .command('set-device-id <id>')
            .description('Overrides the device id.')
            .action(function(id) {
                common.saveToDeviceConfig(configFileKey.deviceId, id);
                logger.info("Device ID set to: %s", id);
            });

        program
            .command('clear-device-id')
            .description('Reverts to using the default device id.')
            .action(function() {
                common.saveToDeviceConfig(configFileKey.deviceId, false);
                logger.info("Device ID cleared.");
            });

        program
            .command('gateway-id')
            .description('Displays the geteway id.')
            .action(function() {
                getGatewayId(function (id) {
                    logger.info("Gateway ID: %s", id);
                });
            });

        program
            .command('set-gateway-id <id>')
            .description('Overrides the geteway id.')
            .action(function(id) {
                setGatewayId(id, function(id) {
                    logger.info("Gateway Id set to: %s", id);
                });
            });

        program
            .command('set-device-name <name>')
            .description('Change device name')
            .action(function(name) {
                setDeviceName(name, function(name) {
                    logger.info("Device name set to: %s", name);
                });
            });

        program
            .command('reset-device-name')
            .description('Resets to default device name.')
            .action(function() {
                common.saveToDeviceConfig(configFileKey.deviceName, false);
                logger.info("Device name changed to default.");
            });

        program
            .command('save-code <activation_code>')
            .description('Adds the activation code to the device.')
            .action(function(activation_code) {
                common.saveToDeviceConfig(configFileKey.activationCode, activation_code);
                logger.info("Activation code saved.");
            });

        program
            .command('reset-code')
            .description('Clears the activation code of the device.')
            .action(function() {
                common.saveToDeviceConfig(configFileKey.activationCode, null);
                logger.info("Activation code cleared.");
            });

        program
            .command('proxy <host> <port>')
            .description('Sets proxy For REST protocol.')
            .action(function(host, port) {
                setProxy(host, port, function (port, err) {
                    if (!err) {
                        logger.info("Set Proxy data");
                    } else {
                        logger.error(err);
                    }
                });
            });

        program
            .command('reset-proxy')
            .description('Clears proxy For REST protocol.')
            .action(resetProxy);

        program
            .command('set-udp-port <udp_port>')
            .description('Overrides the port UDP listener binds to')
            .action(function(udp_port) {
                setListenerUdpPort(udp_port, function(udp_port, err) {
                    if(!err) {
                        logger.info("UDP port is listening on port: %s", udp_port);
                    } else {
                        logger.error(err);
                    }
                });
            });

        program
            .command('set-logger-level <level>')
            .description('Set the logger level to \'debug\', \'info\', \'warn\', \'error\'')
            .action(function(level) {
                if (loggerLevel[level]) {
                    common.saveToUserConfig(configFileKey.loggerLevel, level);
                    logger.info("Logger Level set to: %s", level);
                } else {
                    logger.error("invalid level: %s - please use %s", level,
                        Object.keys(loggerLevel).toString());
                }
            });

        program
            .command('data-directory')
            .description('Displays current data directory.')
            .action(function() {
                getDataDirectory(function (id) {
                    logger.info("Current data directory: %s", id);
                });
            });

        program
            .command('move-data-directory <path>')
            .description('Change directory where data will be stored')
            .action(function(path) {
                moveDataDirectory (path, function(err) {
                    if(!err) {
                        logger.info("Data directory moved");
                    } else{
                        if(err.errno === 3) {
                            logger.error("Access error to this directory.");
                        } else{
                            logger.info(err.message);
                        }
                    }
                });
            });

        program
            .command('set-data-directory <path>')
            .description('Sets path of directory that contains sensor data.')
            .action(function(directoryPath) {
                setDataDirectory(directoryPath, function(err) {
                    if(!err) {
                        logger.info("Data directory changed.");
                    } else{
                        logger.error(err.message);
                    }
                });
            });

        program
            .command('reset-data-directory')
            .description('Resets to default the path of directory that contains sensor data.')
            .action(function() {
                common.saveToGlobalConfig(configFileKey.dataDirectory, "./data/");
                logger.info("Data directory changed to default.");
            });

    },
    getGatewayId: getGatewayId,
    setGatewayId: setGatewayId,
    setDeviceId: setDeviceId,
    setLastActuationsPullTime: setLastActuationsPullTime,
    getLastActuationsPullTime: getLastActuationsPullTime
};
