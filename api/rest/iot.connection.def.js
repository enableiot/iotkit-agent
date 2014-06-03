/**
 * Created by ammarch on 5/16/14.
 */
"use strict";
var url = require('url');
var config = require('../../config');

var apiconf = config.connector.rest;
/**
 * Top of the hierarchy. Common attributes to every
 * Connection Options
 */
function ConnectionOptions() {
    if (apiconf.proxy && apiconf.proxy.host) {
        this.proxy = apiconf.proxy.host + ":" + apiconf.proxy.port;
    }
    var urlT =  {
        hostname: apiconf.host,
        port: apiconf.port,
        pathname: this.pathname,
        protocol: apiconf.protocol
    };
    if (apiconf.strictSSL === false) {
        this.strictSSL = false;
    }
    this.url = url.format(urlT);
}

module.exports = ConnectionOptions;