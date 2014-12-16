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

var net = require('net'),
    JsonSocket = require('json-socket');

exports.init = function(conf, logger, onMessage) {

    var tcpServerPort = conf.tcp_port || 7070;
    var tcpServerHost = "127.0.0.1";

    function processMessage(data) {
        try {
            logger.debug("Message to process:" + JSON.stringify(data));
            onMessage(data);
        } catch (ex) {
            logger.error('TCP Error on message: %s', ex.message);
            logger.error(ex.stack);
        }
    }

    var server = net.createServer();
    server.listen(tcpServerPort, tcpServerHost);

    server.on('connection', function(socket) {
        logger.debug('TCP connection from %s:%d',   socket.remoteAddress, socket.remotePort);
        if(socket.remoteAddress !== "127.0.0.1") {
                logger.debug("Ignoring remote message from", socket.remoteAddress);
                return;
        }

        socket = new JsonSocket(socket);
        socket.on('message', function(message) {
            logger.debug("Data arrived: " + JSON.stringify(message));
            processMessage(message);
        });
    });

    logger.info("TCP listener started on port:  ", tcpServerPort);

    return server;

};