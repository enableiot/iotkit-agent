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
    path = require('path');

function getConfigName () {
    var filename = "config.json";
    return  path.join(__dirname, '../config/' +  filename);
}

function readConfig () {
    var fullFilename = getConfigName();
    return common.readFileToJson(fullFilename);
}

function writeConfig (data) {
    var fullFilename = getConfigName();
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
var setHostFor = function () {
    var data = readConfig();
    var proxy;
    var host_value = arguments[0][0];
    var port_value = arguments[0][1];
    if (data) {
       proxy = data["default_connector"];
       logger.info("Config Key : ", proxy, " value ", host_value);
       var host_key = 'connector.' + proxy + '.host';
       saveToConfig(host_key, host_value);
       if ( port_value ) {
           var port_key = 'connector.' + proxy + '.port';
           saveToConfig(port_key, port_value);
       }
    }
};
function listHostPort (val) {
    return val.split(':');
}
module.exports = {
    addCommand : function (program) {
        program.option('-p, --connector <proxy>', 'set the proxy to connect Iot Analytics using [mqtt|rest]');
        program.option('-H, --host <host:port>', 'set the host to connect Iot Analytics using the proxy', listHostPort);
        program.option('-c, --savecode <activaton code>', 'add activation code to agent');
        program.option('-C, --resetcode', 'clear added code');
        program.option('-s, --setdeviceid <devideid>', 'override the device id');
        program.option('-D, --cleardeviceid', 'clear the device id override');

    },
    runCommand: function (program) {
        if (program.connector) {
            saveToConfig("default_connector", program.connector);
        } else if (program.initialize) {
            saveToConfig("default_connector", "rest");
            saveToConfig("activation_code", null);
        }
        if (program.host) {
            setHostFor(program.host);
        }
        if (program.savecode) {
            saveToConfig("activation_code", program.savecode);
        } else if (program.resetcode) {
            saveToConfig("activation_code", null);
        }
        if (program.setdeviceid) {
            logger.info("Deviceid will override by : ", program.setdeviceid);
            saveToConfig("device_id", program.setdeviceid);
        } else if (program.cleardeviceid) {
            logger.info("Clearing the Device ID  override");
            saveToConfig("device_id", false);
        }
    }
};