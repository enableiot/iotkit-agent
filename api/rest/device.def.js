"use strict";
var config = require('../../config');
var common = require('../../lib/common');

var ConnectionOptions = require('./iot.connection.def.js');

var PUT_METHOD = 'PUT';
var POST_METHOD = 'POST';

//variable to be returned
var IoTKiT = {};
/**
 * Connection attributes to redirect to Intel Itendtity Main Page
 */
function DeviceActivateOption(data) {
    this.pathname = common.buildPath(config.api.device.act, data.deviceId);
    ConnectionOptions.call(this);
    this.method = PUT_METHOD;
    this.body =  JSON.stringify(data.body);
    this.headers = {
        "Content-type" : "application/json"
    };
}
DeviceActivateOption.prototype = new ConnectionOptions();
DeviceActivateOption.prototype.constructor = DeviceActivateOption;
IoTKiT.DeviceActivateOption = DeviceActivateOption;

function DeviceMetadataOption (data) {
    this.pathname = common.buildPath(config.api.device.update, data.deviceId);
    ConnectionOptions.call(this);
    this.method = PUT_METHOD;
    this.headers = {
            "Content-type" : "application/json",
            "Authorization" : "Bearer " + data.deviceToken
        };

    this.body = JSON.stringify(data.body);
}
DeviceMetadataOption.prototype = new ConnectionOptions();
DeviceMetadataOption.prototype.constructor = DeviceMetadataOption;
IoTKiT.DeviceMetadataOption = DeviceMetadataOption;
/**
 * Build an object option for Request package.
 * @param data
 * @constructor
 * */
function DeviceComponentOption (data) {
    this.pathname = common.buildPath(config.api.device.components, data.deviceId);
    ConnectionOptions.call(this);
    this.method = POST_METHOD;
    this.headers = {
        "Content-type" : "application/json",
        "Authorization" : "Bearer " + data.deviceToken
    };
    this.body = JSON.stringify(data.body);
}
DeviceComponentOption.prototype = new ConnectionOptions();
DeviceComponentOption.prototype.constructor = DeviceComponentOption;
IoTKiT.DeviceComponentOption = DeviceComponentOption;


/**
 * @description Build an object option for Request package.
 * @param data
 * @constructor
 */
function DeviceSubmitDataOption (data) {
    this.pathname = common.buildPath(config.api.submit.data, data.deviceId);
    ConnectionOptions.call(this);
    this.method = POST_METHOD;
    this.headers = {
        "Content-type" : "application/json",
        "Authorization" : "Bearer " + data.deviceToken
    };
    if (data.forwarded) {
        this.headers["forwarded"] = true;
        delete data.forwarded;
    }
    this.body = JSON.stringify(data.body);
}
DeviceSubmitDataOption.prototype = new ConnectionOptions();
DeviceSubmitDataOption.prototype.constructor = DeviceSubmitDataOption;
IoTKiT.DeviceSubmitDataOption = DeviceSubmitDataOption;

module.exports = IoTKiT;
