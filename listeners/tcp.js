var net = require('net');

exports.init = function(conf, logger, onMessage) {

  var tcpServerPort = conf.tcp_port_listen || 7070;
  var tcpServerHost = conf.tcp_host_listen || "127.0.0.1";

  var server = net.createServer(function (socket) {

    logger.debug('TCP connection from %s:%d', 
      socket.remoteAddress, socket.remotePort);
    
    socket.on('data', function(data) {
      try {
        onMessage(JSON.parse(data)); 
      } catch (ex) {
        logger.error('TCP Error on message: %s', ex.message);
        logger.error(ex.stack);
      } 
    });

  });

  server.listen(tcpServerPort, tcpServerHost);
  logger.info("TCP listener started on port:  ", tcpServerPort);

  return server;

};