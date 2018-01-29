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

var fs = require('fs'),
    path = require('path'),
    localConf = "./global.json";

var config = {};

if (fs.existsSync(path.join(__dirname, localConf))) {
    config = require(localConf);
} else {
    process.exit(0);
}

/* override for local development if NODE_ENV is defined to local */
if (process.env.NODE_ENV && (process.env.NODE_ENV.toLowerCase().indexOf("local") !== -1)) {
    config.connector.mqtt.host = "localhost";
    config.connector.mqtt.port = 61613;
    config.connector.mqtt.secure = false;
    config.connector.ws.host = "localhost";
    config.connector.ws.port = 5000;
    config.connector.ws.secure = false;
    config.connector.rest.host = "localhost";
    config.connector.rest.port = 80;
    config.connector.rest.protocol= "http";
    config.logger.PATH = './';

    delete process.env["http_proxy"];
    delete process.env["https_proxy"];
}

/* override the log level */
if (process.env.LOG_LEVEL === "debug" || process.env.LOG_LEVEL === "info" || 
    process.env.LOG_LEVEL === "warn" || process.env.LOG_LEVEL === "error" ) {

    config.logger.LEVEL = process.env.LOG_LEVEL
}


module.exports = config;

module.exports.getGlobalConfigName = function() {
    var fullFileName = path.join(__dirname, localConf);
    if (fs.existsSync(fullFileName)) {
        return fullFileName;
    } else {
        logger.error("Failed to find global config file");
        process.exit(0);
    }
};
