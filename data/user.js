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
    localConf = path.resolve(fs.realpathSync(process.argv[1]), "../config/global.json");

if (!fs.existsSync(localConf)) {
    localConf = path.resolve("config/global.json");
}

var config = {};

if (fs.existsSync(localConf)) {
    config = require(localConf);
} else {
    console.error("Failed to find config file in ", localConf);
    console.error("Run your command from directory", path.dirname(fs.realpathSync(process.argv[1])));
    process.exit(0);
}

module.exports = config;

/* Example usage:
 * config.default_connector = "mqtt";
 * config.connector.rest.timeout = 60000;
 *
 * config.connector.rest.proxy.host = "example.com";
 * config.connector.rest.proxy.port = 1180;
 *
 * // For HTTPS proxy specify protocol https:// in host
 * config.connector.ws.proxy.host = "example.com";
 * config.connector.ws.proxy.port = 911;
 *
 * Please write your changes for config below.
 */

