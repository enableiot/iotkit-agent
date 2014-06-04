/**
 * Created by ammarch on 6/2/14.
 */
var fs = require('fs'),
    logger = require("../lib/logger").init(),
    localConf = "./config.json",
    systemConf = "/etc/iotkit-agent/config.json";

if (fs.existsSync("./config/" + localConf)) {
  var config = require(localConf);
  logger.debug("Using local config file");
}
else if (fs.existsSync(systemConf)) {
  var config = require(systemConf);
  logger.debug("Using system config file");
}
else {
  logger.error("Failed to find conig file");
}

/* override for local development if NODE_ENV is defined to local */
if (process.env.NODE_ENV && (process.env.NODE_ENV.toLowerCase().indexOf("local") !== -1)) {
    config.connector.mqtt.host = "127.0.0.1";
    config.connector.rest.host = "127.0.0.1";
    config.connector.rest.port = 80;
    config.connector.rest.protocol= "http";
}
module.exports = config;
