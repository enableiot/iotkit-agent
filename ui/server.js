/**
 * Created by ammarch on 5/8/14.
 */
"use strict";

var express = require("express"),
    ejs = require('ejs');

module.exports.init = function(conf, logger) {
    var httpServerPort = conf.rest_port_listen || 9090;
    var server = express();
    server.configure(function() {
        server.use(express.favicon());
        server.engine('html', ejs.renderFile);
        server.set('views', __dirname + '/views');
        server.set('view engine', 'html');
        server.use(express.json());
        server.use(express.urlencoded());
        server.use(express.methodOverride());
        server.use(express.errorHandler());
    });
    server.listen(httpServerPort, function() {
        logger.info("REST listener started on port: ", httpServerPort);
    });
    return server;
};