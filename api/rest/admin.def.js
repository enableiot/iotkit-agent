/**
 * Created by ammarch on 6/3/14.
 */
"use strict";
var config = require('../../config');
var common = require('../../lib/common');

var ConnectionOptions = require('./iot.connection.def.js');
var GET_METHOD = 'GET';

var apiconf = config.connector.rest;

//variable to be returned
var IoTKiT = {};
/**
 * Connection attributes to redirect to Intel Itendtity Main Page
 */
function HealthOption(data) {
    this.pathname = apiconf.path.health;
    this.token = null;
    ConnectionOptions.call(this);
    this.method = GET_METHOD;
}
HealthOption.prototype = new ConnectionOptions();
HealthOption.prototype.constructor = HealthOption;
IoTKiT.HealthOption = HealthOption;

module.exports = IoTKiT;
