var express = require('express'),
	http = require('http'),
	fs = require('fs'),
	util = require('util'),
	winston = require('winston');

var app = express(); 
// TODO: Make port configurable 
var server = http.createServer(app).listen(9009);
var io = require('socket.io').listen(server);

app.get('/', function (req, res) {
  res.sendfile('./views/log-viewer.html');
});

io.sockets.on('connection', function (socket) {
	socket.emit('agent-logs', 'Reading agent logs...');
  });

var socketIoLogger = exports.socketIoLogger = winston.transports.socketIoLogger = function (options) {
	this.name = 'socketIoLogger';
	this.level = options.level || 'info';
};

util.inherits(socketIoLogger, winston.Transport);

socketIoLogger.prototype.log = function (level, msg, meta, callback) {
	var output = new Date().toISOString() + " - " + msg;
	io.sockets.emit('agent-logs', output);
};