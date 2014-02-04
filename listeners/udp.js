<<<<<<< HEAD
=======
/*
Copyright (c) 2012, Intel Corporation

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

>>>>>>> e8f0df0223d11cfebd705cae70159c121322d7f2
var dgram = require("dgram");

exports.init = function(conf, logger, onMessage) {

  var udpServerPort = conf.udp_port_listen || 41234;
  var server = dgram.createSocket("udp4");

  server.on("error", function (err) {
    logger.error('UDP Error: ', err.stack);
  });

  server.on("message", function (msg, rinfo) {
    logger.debug('UDP message from %s:%d', rinfo.address, rinfo.port);
    try {
      onMessage(JSON.parse(msg));
    } catch (ex) {
        logger.error('UDP Error on message: %s', ex.message);
        logger.error(ex.stack);
    } 
  });

  server.on("listening", function () {
    var addr = server.address();
    logger.info("UDP listener started on port: ", addr.port);
  });

  server.bind(udpServerPort);

  return server;

};


