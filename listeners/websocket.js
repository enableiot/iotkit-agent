/**
 * Created by GER\ajoskows on 12/11/14.
 */
var WebSocketClient = require('websocket').client;

var init = exports.init = function(conf, logger) {
    var client = new WebSocketClient();

    client.on('connectFailed', function() {
        logger.error("Websocket cannot connect.");
        setTimeout(function() {
            init(conf, logger);
        }, parseInt(conf.connector.ws.retryTime));
    });
    client.on('connect', function(connection){
        logger.info('Websocket listener started on port: ' + conf.listeners.ws_port);
        connection.on('close', function() {
            logger.info("Websocket connection closed.");
            init(conf, logger);
        });
        connection.on('message', function(message) {
            logger.info('Received message: ', message.utf8Data);
        });
    });
    client.connect('ws://' + conf.connector.ws.host + ':' + conf.listeners.ws_port, 'echo-protocol');
    return client;
};