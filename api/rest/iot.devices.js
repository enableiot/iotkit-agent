"use strict";
var httpClient = require('../../lib/httpClient');
var DeviceDef = require('./device.def');
var AuthDef = require('./iot.auth');
var async = require('async');
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
/**
 * The function will Register all components to Analytics using POST
 * if the body is an Array it will send individual post since the bulk api is
 * not ready
 * @param data
 * @param callback
 */
module.exports.registerComponents = function (data, callback){
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
               var compOpt = new DeviceDef.DeviceComponentOption(tempData);
               httpClient.httpRequest(compOpt, function(err, response){
                    done(null, response);
               });
            };
       }), function (err, response) {
            console.info("Components Attributes Send To Analytics UI ");
            callback(null, response);
        }
    );
};
/**
 *
 * @param callback
 */
module.exports.getCredential = function (callback) {
    var authOption = new AuthDef.GetTokenOption();
    return httpClient.httpRequest(authOption, callback);
};
