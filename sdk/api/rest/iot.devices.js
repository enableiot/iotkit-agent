/*
Copyright (c) 2014, Intel Corporation

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

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
var httpClient = require('../../lib/httpClient');
var adminDef = require('./admin.def');
var async = require('async');

/**
 *  @description Gets a list of all devices for an account through API: GET:/v1/api/accounts/{accountId}/devices
 *  @param data.userToken contains the access token
 *  @param data.deviceId id of the device which sends the data
 */
module.exports.getDevices = function(data, callback) {
    var getDevicesOpt = new adminDef.devices.GetDevicesOption(data);
    return httpClient.httpRequest(getDevicesOpt, callback);
};


/**
 *  @description Creates a device through API: POST:/v1/api/accounts/{accountId}/devices
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the device which sends the data
 *  @param data.body the description of the device as described in the API spec
 */
module.exports.createDevice = function(data, callback) {
    var createDeviceOpt = new adminDef.devices.CreateDeviceOption(data);
    return httpClient.httpRequest(createDeviceOpt, callback);
};


/**
 *  @description Gets details of a device through API: GET:/v1/api/accounts/{accountId}/devices/{deviceId}
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the device which sends the data
 *  @param data.deviceId the id of the device
 */
module.exports.getDeviceDetails = function(data, callback) {
    var getDeviceDetailsOpt = new adminDef.devices.GetDeviceDetailsOption(data);
    return httpClient.httpRequest(getDeviceDetailsOpt, callback);
};


/**
 *  @description Updates details of a device through API: PUT:/v1/api/accounts/{accountId}/devices/{deviceId}
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the device which sends the data
 *  @param data.deviceId the id of the device
 *  @param data.body the detail to update as described in the API spec
 */
module.exports.updateDeviceDetails = function(data, callback) {
    var updateDeviceDetailsOpt = new adminDef.devices.UpdateDeviceDetailsOption(data);
    return httpClient.httpRequest(updateDeviceDetailsOpt, callback);
};


/**
 *  @description Delete device through API: DELETE:/v1/api/accounts/{accountId}/devices/{deviceId}
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the device which sends the data
 *  @param data.deviceId the id of the device
 */
module.exports.deleteDevice = function(data, callback) {
    var deleteDeviceOpt = new adminDef.devices.DeleteDeviceOption(data);
    return httpClient.httpRequest(deleteDeviceOpt, callback);
};


/**
 *  @description Activate device through API: DELETE:/v1/api/devices/{deviceId}/activation
 *  @param data.userToken contains the access token
 *  @param data.deviceId the id of the device
 *  @param data.accountId the id of the account
 *  @param data.body contains the activation code as described in API spec
 */
module.exports.activateDevice = function(data, callback) {
    var activateDeviceOpt = new adminDef.devices.ActivateDeviceOption(data);
    return httpClient.httpRequest(activateDeviceOpt, callback);
};


/**
 *  @description Add component to device through API: POST:/v1/api/accounts/{accountId}/devices/{deviceId}/components
 *  @param data.userToken contains the access token
 *  @param data.deviceId the id of the device
 *  @param data.accouontId the id of the account
 *  @param data.body contains the component definition as described in API spec
 */
module.exports.addDeviceComponent = function(data, callback) {
    var addDeviceComponentOpt = new adminDef.devices.AddDeviceComponentOption(data);
    return httpClient.httpRequest(addDeviceComponentOpt, callback);
};


/**
 *  @description Delete component of device through API: DELETE:/v1/api/accounts/{accountId}/devices/{deviceId}/components/{cid}
 *  @param data.userToken contains the access token
 *  @param data.deviceId the id of the device
 *  @param data.accountId the id of the account
 *  @param data.cid the id of the commponent
 */
module.exports.deleteDeviceComponent = function(data, callback) {
    var deleteDeviceComponentOpt = new adminDef.devices.DeleteDeviceComponentOption(data);
    return httpClient.httpRequest(deleteDeviceComponentOpt, callback);
};


/*
 * The following methods should be executed only with device-token not with user/admin token 
 *
 */


/**
 * It passes to a callback the access token
 */
module.exports.registerDevice = function(data, callback) {
    var devOpt = new adminDef.devices.DeviceActivateOption(data);
    return httpClient.httpRequest(devOpt, callback);
};
/**
 * @description It will put a data to analytics UI using device id at data.
 * @param data the data contain the device id and metadata at body to sent
 * @param callback
 */
module.exports.updateMetadataDevice = function(data, callback) {
    var metaDataOpt = new adminDef.devices.DeviceMetadataOption(data);
    return httpClient.httpRequest(metaDataOpt, callback);
};

module.exports.submitData = function (data, callback) {
    var submitDataOpt = new adminDef.devices.DeviceSubmitDataOption(data);
    return httpClient.httpRequest(submitDataOpt, callback);
};

/**
 * @description Gets a device from analytics UI using device id in data.
 * @param data contains device id and metadata in body to sent
 * @param callback
 */

module.exports.getDevice = function(data, callback) {
    var metaDataOpt = new adminDef.devices.DeviceGetOption(data);
    return httpClient.httpRequest(metaDataOpt, callback);
};



/**
 * The function will Register all components to Analytics using POST
 * if the body is an Array it will send individual post since the bulk api is
 * not ready
 * @param data
 * @param callback
 */
module.exports.registerComponents = function (data, callback) {
    var tmp = data.body;
    delete data.body;
    //TODO this shall be replace with Parallel
    // when the bulk operation be ready.
    if (!Array.isArray(tmp)) {
        tmp = [tmp];
    }
    async.parallel(tmp.map(function (comp) {
        var tempData = JSON.parse(JSON.stringify(data));
        tempData.body = comp;
        return function (done) {
            var compOpt = new adminDef.devices.DeviceComponentOption(tempData);
            httpClient.httpRequest(compOpt, function(err, response) {
                done(err, response);
            });
        };
    }),
    function (err, response) {
        callback(err, response);
    });
};
