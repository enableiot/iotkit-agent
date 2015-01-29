var WebSocketClient = require('websocket').client;
var deviceInfo = require('./../data/device'),
    tunnel = require('tunnel');

var init = exports.init = function(conf, logger) {
    var client = new WebSocketClient();
    var tunnelingAgent = null;

	if(conf.connector.ws.proxy.host && conf.connector.ws.proxy.port) {
		if(conf.connector.ws.proxy.host.substr(0,5) === 'https') {
			tunnelingAgent = tunnel.httpsOverHttp({
				proxy: {
					host: conf.connector.ws.proxy.host.substr(8),
					port: conf.connector.ws.proxy.port
				}
			});
		} else {
			tunnelingAgent = tunnel.httpOverHttp({
				proxy: {
					host: conf.connector.ws.proxy.host.substr(7),
					port: conf.connector.ws.proxy.port
				}
			});
		}
	}

	var requestOptions = {
		agent: tunnelingAgent
	};


    client.on('connectFailed', function() {
        logger.error("Websocket cannot connect.");
        setTimeout(function() {
            init(conf, logger);
        }, parseInt(conf.connector.ws.retryTime));
    });
    client.on('connect', function(connection){
        logger.info('Websocket listener started on port: ' + conf.connector.ws.port);
        var initMessageObject = {
            "type": "device",
            "deviceId": deviceInfo.device_id,
            "deviceToken": deviceInfo.device_token
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

	if(conf.connector.ws.secure) {
		client.connect('wss://' + conf.connector.ws.host + ':' + conf.connector.ws.port, 'echo-protocol', null, null, requestOptions);
	} else {
		client.connect('ws://' + conf.connector.ws.host + ':' + conf.connector.ws.port, 'echo-protocol', null, null, requestOptions);
	}

    return client;
};
