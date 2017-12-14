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

'use strict';

var config = require("../../config"),
    logger = require("../logger").init();

var currentProxy;

exports.getProxyConnector = function(proxy) {
    try {
        if(!currentProxy) {
            var protocol = (proxy || config.default_connector);
            logger.debug("Proxy Connector : %s ", protocol , "to be Set");
            var Proxy;
            if(protocol === 'rest+ws') {
                protocol = 'rest';
            }
            Proxy = require("./iot." + protocol);
            currentProxy = Proxy.init(config, logger);
        }
        return currentProxy;
    } catch(err) {
        logger.error("Proxy Connector does not exist: ", err);
    }
};

var currentControl;
exports.getControlConnector = function(proxy) {
    try {
        if(!currentControl) {
            var protocol = (proxy || config.default_connector);
            logger.debug("Proxy Connector : %s ", protocol , "to be Set");
            var Proxy = require("./iot.control." + protocol);
            currentControl = Proxy.init(config, logger);
        }
        return currentControl;
    } catch(err) {
        logger.error("Proxy Connector does not exist: ", err);
    }
};
