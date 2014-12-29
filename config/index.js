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

var fs = require('fs'),
    path = require('path'),
    localConf = "./global.json";

var config = {};

if (fs.existsSync(path.join(__dirname, localConf))) {
    config = require(localConf);
    var userConfig = path.resolve(config['data_directory'], 'user.js');
    if(fs.existsSync(userConfig)){
        config = require(userConfig);
    }
} else {
    console.error("Failed to find config file");
    process.exit(0);
}

/* override for local development if NODE_ENV is defined to local */
if (process.env.NODE_ENV && (process.env.NODE_ENV.toLowerCase().indexOf("local") !== -1)) {
    config.connector.mqtt.host = "127.0.0.1";
    config.connector.mqtt.port = 61613;
    config.connector.mqtt.secure = false;
    config.connector.rest.host = "127.0.0.1";
    config.connector.rest.port = 80;
    config.connector.rest.protocol= "http";
    config.logger.PATH = './';
}
module.exports = config;
