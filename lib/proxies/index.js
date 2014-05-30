/**
 * Created by ammarch on 5/28/14.
 */
'use strict';

var config = require("../../config"),
    logger = require("../../lib/logger").init();

var currentProxy;

exports.getProxyConnector = function(proxy) {
    try {
        if(!currentProxy){
            var p = (proxy || config.default_connector);
            logger.info("Proxy Connector : ", p , "to be Set");
            currentProxy = require("./iot." + p).init(config, logger);
        }
        return currentProxy;
    }
    catch(err) {
        logger.error("Proxy Connector does not exist: ", err);
    }
};