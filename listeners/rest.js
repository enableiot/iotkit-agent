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

var express = require("express");

exports.init = function(conf, logger, onMessage) {

    var httpServerPort = conf.listeners.rest_port || 8000;
    var rest = express();
    rest.configure(function() {
        rest.use(express.favicon());
        rest.use(express.json());
        rest.use(express.urlencoded());
        rest.use(express.methodOverride());
        rest.use(express.errorHandler());
    });

    rest.put('/', function (request, response) {
        var msg = request.body;
        logger.debug('REST Payload: ', msg);
        try {
            onMessage(msg);
            response.send(201);
        } catch (ex) {
            logger.error('REST Error: ', ex.message);
            logger.error(ex.stack);
            response.send(500);
        }
    });

    rest.listen(httpServerPort);

    logger.info("REST listener started on port: %d", httpServerPort);
    return rest;
};

