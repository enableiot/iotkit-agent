var mqtt = require('mqtt'),
    os = require("os"),
    fs =  require("fs"),
    mac = require("getmac"),
    express = require("express"),
    winston = require('winston'),
    dgram = require("dgram"),
    logger = require("./lib/logger").init(),
    utils = require("./lib/utils").init(logger),
    conf = process.env;



utils.getDeviceId(function(id){

    logger.info("Cloud connector for: ", id);
    var cloud = require("./lib/cloud").init(logger, id);

    var msgHandler = function(msg){
        logger.debug("JSON Message: ", msg);
        cloud.send(msg);
    };

    logger.info("Starting listeners...");
    require("./listeners/rest").init(logger, msgHandler);
    require("./listeners/udp").init(logger, msgHandler);
    require("./listeners/tcp").init(logger, msgHandler);
    require("./listeners/mqtt").init(logger, msgHandler);

});


