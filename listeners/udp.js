var dgram = require("dgram"),
    conf = process.env;

exports.init = function(logger, onMessage) {

  var udpServerPort = conf.SERVER_UDP_PORT || 41234;
  var server = dgram.createSocket("udp4");

  server.on("error", function (err) {
    logger.error('UDP Error: ', err.stack);
  });

  server.on("message", function (msg, rinfo) {
    logger.info('UDP message from %s:%d', rinfo.address, rinfo.port);
    try {
      onMessage(JSON.parse(msg));
    } catch (ex) {
        logger.error('UDP Error on message: %s', ex);
    } 
  });

  server.on("listening", function () {
    var addr = server.address();
    logger.info("UDP listener started on port: ", addr.port);
  });

  server.bind(udpServerPort);

  return server;

};


