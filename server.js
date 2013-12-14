var mqtt = require('mqtt'),
    os = require("os"),
    fs =  require("fs"),
    mac = require("getmac"),
    winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ 
        level: 'verbose',
        colorize: true
    }),
    new (winston.transports.File)({ 
        filename: process.env.AGENT_LOG_FILE || './agent.log',
        colorize: true,
        level: 'warn'
    })
  ]
});

logger.info('Configuring agent...');

// Local variables
var device_id = 'd-' + os.hostname().toLowerCase(); // default
var account_id, broker_topic;

// Message endpoint variables
var SERVER_PORT = process.env.SERVER_PORT || 1883;
var BROKER_HOST = process.env.BROKER_HOST || 'data.enableiot.com';
var BROKER_PORT = process.env.BROKER_PORT || 8884;
var BROKER_DATA_TOPIC = process.env.BROKER_DATA_TOPIC || "data";
var BROKER_OPTS = {
   keyPath: process.env.BROKER_HOST_KEY || 'certs/client.key',
   certPath: process.env.BROKER_HOST_CERT || 'certs/client.crt',
   username: process.env.BROKER_HOST_USR || 'username',
   password: process.env.BROKER_HOST_PSW || 'password',
   keepalive: 30000
}

mac.getMac(function(err, macAddress){
    if (err) logger.error('Unable to get MAC address', err);
    device_id = macAddress; 
});

var getTimestamp = function(){
    return new Date().getTime();
}

var cloneObject = function(obj1){
    return JSON.parse(JSON.stringify(obj1));
}

var makeItem = function(name, value){
    var item_template = { 
        "name": "",
        "sample": [ { "value": 0, "timestamp": 0 } ]
    }
    var item = cloneObject(item_template);
        item.name = name;
        item.sample[0].value = value;
        item.sample[0].timestamp = getTimestamp();
    return item;
}

var makeMetrics = function(src, metric, value){
    var msg = {
        "msg_type": "metrics_msg",
        "sender_id": device_id,
        "account_id": account_id,
        "timestamp": getTimestamp(),
        "data_source": [
            {
                "name": src,
                "metrics": []
            }
        ]
    };
    // Add metrics to the message
    msg.data_source[0].metrics[0] = makeItem(metric, value);

    // If in debug than print to console, else send to broker
    logger.info('Message: ', msg);
    broker.publish(broker_topic, JSON.stringify(msg));
}


// Local variables
account_id = BROKER_OPTS.username;
broker_topic = BROKER_DATA_TOPIC + "/" + account_id + "/" + device_id
broker = mqtt.createSecureClient(BROKER_PORT, BROKER_HOST, BROKER_OPTS);


// Server
logger.info('Starting MQTT broker on %s ...', SERVER_PORT);
mqtt.createServer(function(client) {

  logger.info('Server created...');

  client.on('connect', function(packet) {
    client.connack({returnCode: 0});
    client.id = packet.clientId;
    logger.info('MQTT Client connected: %s', packet.clientId);
  });

  client.on('publish', function(packet) {
    var topic = packet.topic;
    var topicParts = topic.split('/');
    logger.info('Topic: %s Payload: %s', packet.topic, packet.payload);
    if (topicParts.length == 2){
        makeMetrics(topicParts[0], topicParts[1], packet.payload);
    }
  });

  client.on('pingreq', function(packet) {
    client.pingresp();
  });

  client.on('disconnect', function(packet) {
    client.stream.end();
  });

  client.on('error', function(err) {
    client.stream.end();
    logger.error('MQTT Error: %s', err);
  });

}).listen(SERVER_PORT);

