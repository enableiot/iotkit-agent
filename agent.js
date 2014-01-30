var mqtt = require('mqtt'),
    os = require("os"),
    fs =  require("fs"),
    mac = require("getmac"),
    express = require("express"),
    winston = require('winston'),
    dgram = require("dgram"),
    logger = require("./lib/logger").init(),
    utils = require("./lib/utils").init(logger);

var sensorList = {};

utils.getDeviceId(function(id){

    logger.info("IoT Kit Cloud Agent: ", id);
    var conf = utils.getConfig();
    var cloud = require("./lib/cloud").init(conf, logger, id);
    var agentMessage = require("./lib/agent-message");
    agentMessage.init(logger, cloud, sensorList);

    cloud.reg(sensorList);

    var msgHandler = agentMessage.messageHandler;

    logger.info("Starting listeners...");
    require("./listeners/rest").init(conf, logger, msgHandler);
    require("./listeners/udp").init(conf, logger, msgHandler);
    require("./listeners/tcp").init(conf, logger, msgHandler);
    require("./listeners/mqtt").init(conf, logger, msgHandler);

});


