/**
 * Created by ammarch on 6/2/14.
 */
var config = require('./config.json');

/* override for local development if NODE_ENV is defined to local */
if (process.env.NODE_ENV && (process.env.NODE_ENV.toLowerCase().indexOf("local") !== -1)) {
    config.connector.mqtt.host = "127.0.0.1";
    config.connector.rest.host = "127.0.0.1";
    config.connector.rest.port = 80;
    config.connector.rest.protocol= "http";
}
module.exports = config;
