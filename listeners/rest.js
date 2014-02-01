var express = require("express");


exports.init = function(conf, logger, onMessage) {

  var httpServerPort = conf.rest_port_listen || 9090;
  var rest = express();
  rest.configure(function() {
      rest.use(express.favicon());
      rest.use(express.json());
      rest.use(express.urlencoded());
      rest.use(express.methodOverride());
      rest.use(express.errorHandler());
  });

  rest.put('/', function (request, response) {
      var msg = request.body;
      logger.debug('REST Payload: ', msg);
      try {
          onMessage(msg);
          response.send(200);
      } catch (ex) {
          logger.error('REST Error: ', ex.message);
          logger.error(ex.stack);
          response.send(500);
      }
  });

  rest.listen(httpServerPort);
  logger.info("REST listener started on port: ", httpServerPort);
  return rest;

};

