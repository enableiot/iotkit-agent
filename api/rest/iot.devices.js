"use strict";
var httpClient = require('../../lib/httpClient');
var DeviceDef = require('./device.def');
var AuthDef = require('./iot.auth');

/**
 * It passes to a callback the access token
 */
module.exports.registerDevice = function(data, callback) {
  var devOpt = new DeviceDef.DeviceActivateOption(data);
  return httpClient.httpRequest(devOpt, callback);
};
/**
 * @description It will put a data to analytics UI using device id at data.
 * @param data the data contain the device id and metadata at body to sent
 * @param callback
 */
module.exports.updateMetadataDevice = function(data, callback) {
    var metaDataOpt = new DeviceDef.DeviceMetadataOption(data);
    return httpClient.httpRequest(metaDataOpt, callback);
};

module.exports.submitData = function (data, callback) {
    var submitDataOpt = new DeviceDef.DeviceSubmitDataOption(data);
    return httpClient.httpRequest(submitDataOpt, callback);
};

function mCallback (callback, wait) {
    var waitFor = wait || 1;
    var finalCall = callback;
    var count = 0;
    var inCallback = function (data) {
        count++;
        if (waitFor === count) {
                finalCall(data);
            }
        };
    return inCallback;
}
/**
 * The function will Register all components to Analytics using POST
 * if the body is an Array it will send individual post since the bulk api is
 * not ready
 * @param data
 * @param callback
 */
module.exports.registerComponents = function (data, callback){
    var compOpt;
    function regComponent(data, cb) {
        compOpt = new DeviceDef.DeviceComponentOption(data);
        httpClient.httpRequest(compOpt, cb);
        }

    var tmp = data.body;
    delete data.body;
    //TODO this shall be replace when the bulk operation be ready.
    if (Array.isArray(tmp)) {
        var c = mCallback(callback, tmp.length);
        var i,
            length = tmp.length;
        for (i = 0; i < length; i++) {
            data.body = tmp[i];
            regComponent(data, c);
        }
    } else {
        data.body = tmp;
        regComponent(data, mCallback(callback));
    }

};
/**
 *
 * @param callback
 */
module.exports.getCredential = function (callback) {
    var authOption = new AuthDef.GetTokenOption();
    return httpClient.httpRequest(authOption, callback);
};
