var logger = require("./lib/logger").init(),
    utils = require("./lib/utils").init(logger);

utils.getDeviceId(function(id){

    logger.info("IoT Kit Cloud Agent: ", id);
    var conf = utils.getConfig();
    
    // configure sensor store 
    var sensorsStore = require("./lib/sensors-store");
        sensorsStore.init(logger);
    
    var sensorsList = sensorsStore.getSensorsList();
    
    // create a cloud connector
    var cloud = require("./lib/cloud").init(conf, logger, id, sensorsStore);
    
    // configure message provider
    var agentMessage = require("./lib/agent-message");
        agentMessage.init(logger, cloud, sensorsList);
    
    // register device
    cloud.reg(sensorsList, agentMessage.registrationCompleted);

    // create a local pub handler
    var msgHandler = agentMessage.messageHandler;

    logger.info("Starting listeners...");
    require("./listeners/rest").init(conf, logger, msgHandler);
    require("./listeners/udp").init(conf, logger, msgHandler);
    require("./listeners/tcp").init(conf, logger, msgHandler);
    require("./listeners/mqtt").init(conf, logger, msgHandler);

});


process.on("uncaughtException", function(err) {
  logger.error("UncaughtException:", err.message);
  logger.error(err.stack);
  // let the process exit so that forever can restart it
  process.exit(1); 
});