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

var dgram = require("dgram");

function Server(udpServerPort, logger) {
    var me = this;
    me.logger = logger;
    me.server = dgram.createSocket("udp4");

    me.server.on("error", function (err) {
        me.logger.error('UDP Error: ', err.stack);
    });
    me.server.on('close', function(rinfo){
        console.log('UDP Closing from ', rinfo);
    });
    me.server.on("message", function (msg, rinfo) {
        me.logger.debug('UDP message from %s:%d', rinfo.address, rinfo.port);
        if(rinfo.address !== "127.0.0.1") {
            me.logger.debug('Ignoring external UDP message from %s', rinfo.address);
            return;
        }
        try {
            if (me.handleronMessage) {
                var data = JSON.parse(msg);
                data.r = rinfo;
                me.handleronMessage(data);
            }
        } catch (ex) {
            me.logger.error('UDP Error on message: %s', ex.message);
            me.logger.error(ex.stack);
        }
    });
    me.server.on("listening", function () {
        var addr = me.server.address();
        me.logger.info("UDP listener started on port: ", addr.port);
    });
    me.server.bind(udpServerPort);
}

Server.prototype.listen = function (handler) {
    var me = this;
    me.handleronMessage = handler;
};
Server.prototype.send = function (toClient, data) {
    var me = this;
    var msg = new Buffer(JSON.stringify(data));
    me.server.send(msg, 0, msg.length, toClient.port, toClient.address, function(err, bytes){
        me.logger.debug("Response Send", err , " bytes ", bytes);
    });
};
var server;
module.exports.singleton = function (port, logger) {
    if (!server) {
        server = new Server(port, logger);
    }
    return server;
};


