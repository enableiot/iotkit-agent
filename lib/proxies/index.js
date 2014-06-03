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
            logger.debug("Proxy Connector : %s ", p , "to be Set");
            var Proxy = require("./iot." + p);
            currentProxy = Proxy.init(config, logger);
        }
        return currentProxy;
    }
    catch(err) {
        logger.error("Proxy Connector does not exist: ", err);
    }
};