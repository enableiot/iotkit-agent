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
                    done(err, response);
               });
            };
       }), function (err, response) {
            console.info("Attributes sent");
            callback(err, response);
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
