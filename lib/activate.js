/**
 * Created by ammarch on 5/22/14.
 */
"use strict";
var logger = require("./logger").init(),
    conf = require('../config'),
    Cloud = require("../api/cloud.proxy");

var cloud;

module.exports = {
   activate: function (id, code, callback) {
       if ("function" === typeof code) {
            callback = code;
       } else {
            conf.activation_code = code;
       }
       cloud = Cloud.init(conf, logger, id);
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
        cloud.disconnect();
        cloud = null;
    }
};