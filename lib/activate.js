/**
 * Created by ammarch on 5/22/14.
 */
"use strict";
var logger = require("./logger").init(),
    Broker = require("./mqtt-connector/connector"),
    conf = require('../config'),
    Cloud = require("./cloud");

var brokerConnector = new Broker(conf.broker, logger);

module.exports = {
    connect: function (callback) {
        brokerConnector.connect(function(err) {
                if (!err) {
                    callback();
                } else {
                    logger.error("Connector Fail to connect to Broker or Proxy...", err);
                }
        });
    },
    activate: function (id, code, callback) {
       if ("function" === typeof code) {
            callback = code;
        } else {
            conf.activation_code = code;
        }
        var cloud = Cloud.init(conf, brokerConnector, logger, id);
        cloud.activate(function (err) {
            if (!err) {
                logger.info("Device Activated ");
                callback(cloud);
            } else {
                callback(false);
                logger.error("Error in the activation process ...", err);
            }
        });
    },
    disconnect: function () {
        brokerConnector.disconnect();
    }
};