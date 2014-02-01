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


