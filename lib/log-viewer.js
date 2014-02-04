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

function SocketIoLogger(conf){
	var express = require('express'),
		io = require('socket.io'),
		http = require('http'),
		util = require('util'),
		winston = require('winston'),
		logTopic = 'agent-logs';
	var app = express(), 
    	server = http.createServer(app), 
    	io = io.listen(server, { log: false });
		
	server.listen(conf.log_viewer_port);

	app.get('/', function (req, res) {
	  res.sendfile('./views/log-viewer.html');
	});

	io.sockets.on('connection', function (socket) {
		socket.emit(logTopic, 'Reading agent logs...');
	});
	
	var socketIoLogger = exports.socketIoLogger = winston.transports.socketIoLogger = function (options) {
		this.name = 'socketIoLogger';
		this.level = options.level || 'debug';
		this.timestamp = options.timestamp || true;
		this.prettyPrint = options.prettyPrint || true;
	};
	
	// inherit from the basic winston transport 
	util.inherits(socketIoLogger, winston.Transport);
	
	/*
		Override the log method to parse the output and emit it to socket 
	*/
	socketIoLogger.prototype.log = function(level, msg, meta, callback) {
	
		var output = new Date().toISOString() + " - " + msg;
	
		// check for log arguments 
		if (meta !== null && meta !== undefined) {
	
			// if error then also add the stack 
			if (meta && meta instanceof Error && meta.stack) {
				meta = meta.stack;
			}
	
			// if not object than add raw else inspect it
			if (typeof meta !== 'object') {
				output += ' ' + meta;
			} else if (Object.keys(meta).length > 0) {
				output += ' ' + (util.inspect(meta, false, null, false));
			}
		}
	
		io.sockets.emit(logTopic, output);
		callback(null, true);
	};
	
	return new (socketIoLogger)({
	      level: conf.VIEWER_LOG_LEVEL || 'debug',
	      timestamp: true,
	      prettyPrint: true
	    });
};

exports.init = function(conf) {
  return new SocketIoLogger(conf);
};  