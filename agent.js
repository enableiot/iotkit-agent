var logger = require("./lib/logger").init(),
    utils = require("./lib/utils").init(logger);

var sensorsList = {};

utils.getDeviceId(function(id){

    logger.info("IoT Kit Cloud Agent: ", id);
    var conf = utils.getConfig();
    var cloud = require("./lib/cloud").init(conf, logger, id);
    
    var sensorsListRepo = require("./lib/sensors-list-repository");
    sensorsList = sensorsListRepo.getSensorsList() || {};
    
    var agentMessage = require("./lib/agent-message");
    agentMessage.init(logger, cloud, sensorsList);
    
    cloud.reg(sensorsList, agentMessage.registrationCompleted);

    var msgHandler = agentMessage.messageHandler;

    logger.info("Starting listeners...");
    require("./listeners/rest").init(conf, logger, msgHandler);
    require("./listeners/udp").init(conf, logger, msgHandler);
    require("./listeners/tcp").init(conf, logger, msgHandler);
    require("./listeners/mqtt").init(conf, logger, msgHandler);

});


