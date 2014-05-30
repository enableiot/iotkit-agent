/**
 * Created by ammarch on 5/16/14.
 */
"use strict";
var url = require('url');
var config = require('../../config');
//variable to be returned

/**
 * Top of the hierarchy. Common attributes to every
 * Connection Options
 */
function ConnectionOptions() {
    if (config.rest.proxy && config.rest.proxy.host) {
        this.proxy = config.rest.proxy.host + ":" + config.rest.proxy.port;
    }
    var urlT =  {
        hostname: config.rest.host,
        port: config.rest.port,
        pathname: this.pathname,
        protocol: config.rest.protocol
    };
    if (config.rest.strictSSL === false) {
        this.strictSSL = false;
    }
    this.url = url.format(urlT);
}

module.exports = ConnectionOptions;