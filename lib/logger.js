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
var winston = require('winston'),
    conf = process.env;

exports.init = function(utils) {

  var socketIo;

  var logTransports = [
    new (winston.transports.Console)({ 
          level: conf.CONSOLE_LOG_LEVEL || 'debug',
          colorize: true,
          timestamp: true
    }),
    new (winston.transports.File)({ 
          filename: conf.AGENT_LOG_FILE || './agent.log',
          level: conf.FILE_LOG_LEVEL || 'warn',
          timestamp: true
    })
  ];

  var localConf = utils.getConfig();
  if (localConf.log_viewer== "on"){
    logTransports.push(require('./log-viewer').init(localConf));
  }

  return new (winston.Logger)({
    transports: logTransports,
    exitOnError: false
  });
  
};  
