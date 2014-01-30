var mqtt = require('mqtt');

exports.init = function(conf, logger, onMessage) {


  var mqttServerPort = conf.mqtt_port_listen || 1883;
  var mqttServer = mqtt.createServer(function(client) {

    client.on('connect', function(packet) {
      client.connack({returnCode: 0});
      client.id = packet.clientId;
      logger.debug('MQTT Client connected: ', packet.clientId);
    });

    client.on('publish', function(packet) {
      logger.debug('MQTT Topic: %s Payload: %s', packet.topic, packet.payload);
      try {
        onMessage(JSON.parse(packet.payload));
      } catch (ex) {
        logger.error('MQTT Error on message: %s', ex);
      }
  });

    client.on('pingreq', function(packet) {
      client.pingresp();
    });

    client.on('disconnect', function(packet) {
      client.stream.end();
    });

    client.on('error', function(err) {
      //client.stream.end();
      logger.error('MQTT Error: ', err);
    });

  }).listen(mqttServerPort);

  logger.info("MQTT listener started on port: ", mqttServerPort);

  return mqttServer;

};


