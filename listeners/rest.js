var express = require("express"),
    conf = process.env;


exports.init = function(logger, onMessage) {

  var httpServerPort = conf.SERVER_REST_PORT || 8080;
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
      logger.info('REST Payload: ', msg);
      try {
          onMessage(msg);
          response.send(200);
      } catch (ex) {
          logger.error('REST Error: ', ex);
          response.send(500);
      }
  });

  rest.listen(httpServerPort);
  logger.info("REST listener started on port: ", httpServerPort);
  return rest;

};

