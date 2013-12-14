var mqtt = require('mqtt'),
    os = require("os"),
    fs =  require("fs"),
    mac = require("getmac"),
    express = require("express"),
    winston = require('winston');

// Logging
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
var SERVER_MQTT_PORT = process.env.SERVER_MQTT_PORT || 1883;
var SERVER_REST_PORT = process.env.SERVER_REST_PORT || 8080;
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

var makeMetrics = function(src, val){

    if (!val) throw "Null val";
    if (!val.metric) throw "Null val.metric";
    if (!val.value) throw "Null val.value";

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
    msg.data_source[0].metrics[0] = makeItem(val.metric, val.value);

    // If in debug than print to console, else send to broker
    logger.info('Message: ', msg);
    broker.publish(broker_topic, JSON.stringify(msg));
}

// ************************************************************
// Local variables
// ************************************************************
account_id = BROKER_OPTS.username;
broker_topic = BROKER_DATA_TOPIC + "/" + account_id + "/" + device_id
broker = mqtt.createSecureClient(BROKER_PORT, BROKER_HOST, BROKER_OPTS);

// ************************************************************
// REST Server
// ************************************************************
var rest = express();
logger.info('Starting REST broker on %s ...', SERVER_REST_PORT);
rest.configure(function() {
    rest.use(express.favicon());
    rest.use(express.logger('dev'));
    rest.use(express.json());
    rest.use(express.urlencoded());
    rest.use(express.methodOverride());
    rest.use(express.errorHandler());
});

rest.get('/', function (request, response) {
    response.json({
      namespace: 'sensor', 
      payload: '{"metric": "metric name", "value"; 0.00}'
    });
});

rest.put('/:device', function (request, response) {
    
    var device = request.params.device;
    var msg = request.body;

    logger.info('REST Topic: %s Payload: ', device, msg);
    
    try {
        makeMetrics(device, msg);
        response.send(200);
    } catch (ex) {
        logger.error('Error on rest: %s', ex);
        response.send(404);
    }
});

rest.listen(SERVER_REST_PORT);

// ************************************************************
// MQTT Server
// ************************************************************
logger.info('Starting MQTT broker on %s ...', SERVER_MQTT_PORT);
mqtt.createServer(function(client) {

  logger.info('Server created...');

  client.on('connect', function(packet) {
    client.connack({returnCode: 0});
    client.id = packet.clientId;
    logger.info('MQTT Client connected: %s', packet.clientId);
  });

  client.on('publish', function(packet) {
    logger.info('MQTT Topic: %s Payload: %s', packet.topic, packet.payload);
    makeMetrics(packet.topic, JSON.parse(packet.payload));
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

}).listen(SERVER_MQTT_PORT);

