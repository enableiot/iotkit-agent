/**
 * Created by ammarch on 5/27/14.
 */
"use strict";
var url = require('url');
var config = require('../config');

/**
 * Top of the hierarchy. Common attributes to every
 * Connection Options
 */


function ProxyOptions() {
    me.logger = logger;
    me.retries = 0;
    me.max_retries = conf.activation_retries || 10;
    me.logger.info('MQTT Cloud Created');
}

module.exports = ProxyOptions;