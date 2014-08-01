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

var logger = require("../lib/logger").init(),
    common = require('../lib/common'),
    utils = require("../lib/utils").init(),
    path = require('path');

function readConfig () {
    var fullFilename = common.getConfigName();
    return common.readFileToJson(fullFilename);
}

function writeConfig (data) {
    var fullFilename = common.getConfigName();
    common.writeToJson(fullFilename, data);
}
var saveToConfig = function () {
    if (arguments.length < 2) {
        logger.error("Not enough arguments : ", arguments);
        process.exit(1);
    }
    var key = arguments[0];
    var value = arguments[1];
    var data = readConfig();
    var keys = key.split('.');
    var configSaver = function (data, keys) {
        var k = keys.splice(0, 1);
        if (data && (data[k[0]] !== undefined)) {
            logger.info("Config Key : ", k[0], " value ", value);
            if (keys.length > 0) {
                data[k[0]] = configSaver(data[k[0]], keys);
            } else {
                data[k[0]] = value;
                logger.debug("Config Key : ", data);
            }
            return data;
        } else {
            logger.error("Key : ", key, " not found");
            return false;
        }
    };
    data = configSaver(data, keys);
    if (data) {
        writeConfig(data);
    }
    return true;
};

var setHostFor = function (host_value, port_value) {
    var data = readConfig();
    var proxy;
    if (data) {
       proxy = data["default_connector"];
       logger.info("Config Key : ", proxy, " value ", host_value);
       var host_key = 'connector.' + proxy + '.host';

       if(proxy === "rest"){
           var protocol;
           var protocol_key = 'connector.' + proxy + '.protocol';
           if(host_value.indexOf("https://")===0){
               host_value = host_value.replace("https://", "");
               protocol = "https";
           }else if(host_value.indexOf("http://")===0){
               host_value = host_value.replace("http://", "");
               protocol = "http";
           }
           if(protocol){
               saveToConfig(protocol_key, protocol);
           }
       }
       saveToConfig(host_key, host_value);
       if (port_value) {
        var port_key = 'connector.' + proxy + '.port';
        saveToConfig(port_key, port_value);
       }
    }
};


var setProxy = function (host_proxy, port_proxy) {
    saveToConfig("connector.rest.proxy.host", host_proxy);
    saveToConfig("connector.rest.proxy.port", port_proxy);
    logger.info("Set Proxy data");
};
var resetProxy = function () {
    saveToConfig("connector.rest.proxy.host", false);
    saveToConfig("connector.rest.proxy.port", false);
    logger.info("Set Proxy data");
};

var loggerLevel = {
    info: true,
    warn: true,
    error: true,
    debug: true
};
module.exports = {
    addCommand : function (program) {
        program
            .command('protocol <protocol>')
            .description('Set the protocol to \'mqtt\' or \'rest\'')
            .action(function(protocol){
                if (protocol === 'mqtt' || protocol === 'rest') {
                    saveToConfig("default_connector", protocol);
                    logger.info("protocol set to: " + protocol);
                } else {
                    logger.error("invalid protocol: %s - please use \'mqtt\' or \'rest\'", protocol);
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
                saveToConfig("device_id", id);
                logger.info("Device ID set to: %s", id);
            });

        program
            .command('clear-device-id')
            .description('Reverts to using the default device id.')
            .action(function() {
                saveToConfig("device_id", false);
                logger.info("Device ID cleared.");
            });

        program
            .command('save-code <activation_code>')
            .description('Adds the activation code to the device.')
            .action(function(activation_code) {
                saveToConfig("activation_code", activation_code);
                logger.info("Activation code saved.");
            });

        program
            .command('reset-code')
            .description('Clears the activation code of the device.')
            .action(function() {
                saveToConfig("activation_code", null);
                logger.info("Activation code cleared.");
            });

        program
            .command('proxy <host> <port>')
            .description('Sets proxy For REST protocol.')
            .action(setProxy);

        program
            .command('reset-proxy')
            .description('Clears proxy For REST protocol.')
            .action(resetProxy);

        program
            .command('set-logger-level <level>')
            .description('Set the logger level to \'debug\', \'info\', \'warn\', \'error\'')
            .action(function(level) {
                if (loggerLevel[level]) {
                    saveToConfig("logger.LEVEL", level);
                    logger.info("Logger Level set to: %s", level);
                } else {
                    logger.error("invalid level: %s - please use %s", level,
                                                Object.keys(loggerLevel).toString());
                }
            });

        program
            .command('set-data-directory <path>')
            .description('Sets path of directory that contains sensor data.')
            .action(function(path) {
                saveToConfig("data_directory", path);
                logger.info("Data directory changed.");
            });

        program
            .command('reset-data-directory')
            .description('Resets to default the path of directory that contains sensor data.')
            .action(function() {
                saveToConfig("data_directory", path.join(__dirname, '../data/'));
                logger.info("Data directory changed to default.");
            });

    }
};
