var net = require('net'),
    conf = process.env;

exports.init = function(logger, onMessage) {

  var tcpServerPort = conf.SERVER_TCP_PORT || 7070;
  var tcpServerHost = conf.SERVER_TCP_HOST || "127.0.0.1";

  var server = net.createServer(function (socket) {

    logger.debug('TCP connection from %s:%d', 
      socket.remoteAddress, socket.remotePort);
    
    socket.on('data', function(data) {
      try {
        onMessage(JSON.parse(data)); 
      } catch (ex) {
        logger.error('TCP Error on message: %s', ex);
      } 
    });

  });

  server.listen(tcpServerPort, tcpServerHost);
  logger.info("TCP listener started on port:  ", tcpServerPort);

  return server;

};