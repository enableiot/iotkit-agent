#!/usr/bin/env node
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
"use strict";
var utils = require("../lib/utils").init(),
    logger = require("../lib/logger").init(),
    Cloud = require("../api/cloud.proxy"),
    Control = require ("../api/control.proxy"),
    Message = require('../lib/agent-message'),
    updServer = require('../lib/server/udp'),
    Listener = require("../listeners/"),
    admin= require('../lib/commander'),
    pkgJson = require('../package.json'),
    path = require('path'),
    fs = require('fs'),
    conf = require('../config');

process.on("uncaughtException", function(err) {
    logger.error("UncaughtException:", err.message);
    logger.error(err.stack);
    // let the process exit so that forever can restart it
    process.exit(1);
});

admin.version(pkgJson.version)
    .option('-C, --config [path]', "Set the config file path", function(userConfDirectory){
        process.userConfigPath = path.resolve(userConfDirectory , "user.js");
        if (fs.existsSync(process.userConfigPath)) {
            logger.info("\'" + process.userConfigPath + "\'" +
                ' will be used as user config file.');
            conf = require(process.userConfigPath);
        }
        else{
            logger.error("\'" + process.userConfigPath + "\'" +
                ' not contains user.js config file.');
            process.exit(1);
        }
    });

admin.parse(process.argv);

utils.getDeviceId(function (id) {
    var cloud = Cloud.init(logger, id);
    cloud.activate(function (status) {
       if (status === 0) {
            var udp = updServer.singleton(conf.listeners.udp_port, logger);

            var agentMessage = Message.init(cloud, logger);
            logger.info("Starting listeners...");
            udp.listen(agentMessage.handler);
            //TODO only allow for mqtt Connector, until rest will be implemented
            if (conf.default_connector === 'mqtt'){
               var ctrl = Control.init(conf, logger, id);
               ctrl.bind(udp);
            }
            Listener.TCP.init(conf.listeners, logger, agentMessage.handler);

        } else {
            logger.error("Error in activation... err # : ", status);
            process.exit(status);
        }
    });
});
