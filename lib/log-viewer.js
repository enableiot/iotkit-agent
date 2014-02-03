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