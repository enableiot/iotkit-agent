/*
Copyright (c) 2014, Intel Corporation

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.
    * Neither the name of Intel Corporation nor the names of its contributors
      may be used to endorse or promote products derived from this software
      without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

"use strict";
var config = require('../../config');
var common = require('../../lib/common');

var ConnectionOptions = require('./iot.connection.def.js');

var PUT_METHOD = 'PUT';
var POST_METHOD = 'POST';

var apiconf = config.connector.rest;

//variable to be returned
var IoTKiT = {};
/**
 * Connection attributes to redirect to Intel Itendtity Main Page
 */
function DeviceActivateOption(data) {
    this.pathname = common.buildPath(apiconf.path.device.act, data.deviceId);
    this.token = null;
    ConnectionOptions.call(this);
    this.method = PUT_METHOD;
    this.body =  JSON.stringify(data.body);
}
DeviceActivateOption.prototype = new ConnectionOptions();
DeviceActivateOption.prototype.constructor = DeviceActivateOption;
IoTKiT.DeviceActivateOption = DeviceActivateOption;

function DeviceMetadataOption (data) {
    this.pathname = common.buildPath(apiconf.path.device.update, data.deviceId);
    this.token = data.deviceToken;
    ConnectionOptions.call(this);
    this.method = PUT_METHOD;
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
    this.pathname = common.buildPath(apiconf.path.device.components, data.deviceId);
    this.token = data.deviceToken;
    ConnectionOptions.call(this);
    this.method = POST_METHOD;
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
    this.pathname = common.buildPath(apiconf.path.submit.data, data.deviceId);
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
