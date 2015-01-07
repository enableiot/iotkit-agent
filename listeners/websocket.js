var WebSocketClient = require('websocket').client;
var deviceToken = require('./../certs/token').deviceToken;

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
        var initMessageObject = {
            "type": "device",
            "deviceId": conf.device_id,
            "deviceToken": deviceToken
        };
        connection.sendUTF(JSON.stringify(initMessageObject));
        connection.on('close', function() {
            logger.info("Websocket connection closed.");
            init(conf, logger);
        });
        connection.on('message', function(message) {
            logger.info('Fired STATUS: ', message.utf8Data);
        });
    });
    client.connect('ws://' + conf.connector.ws.host + ':' + conf.listeners.ws_port, 'echo-protocol');
    return client;
};
