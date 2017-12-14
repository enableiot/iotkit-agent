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
var userAdminDef = require('./admin.def');


/**
 *  @description Sends data to cloud through API:POST/v1/api/data/{deviceId}
 *  @param data.body the data JSON object according to the API spec for this call 
 *  @param data.userToken contains the access token
 *  @param data.deviceId id of the device which sends the data
 */
module.exports.submitData = function(data, callback) {
    var submitDataOpt = new userAdminDef.data.SendDataOption(data);
    return httpClient.httpRequest(submitDataOpt, callback);
};


/**
 *  @description Retrieve data from cloud through API:POST/v1/api/accounts/{accountId}/data/search
 *  @param data.body the detail of the search data JSON object according to the API spec for this call 
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the account where the search is performed
 */
module.exports.searchData = function(data, callback) {
    var searchDataOpt = new userAdminDef.data.SearchDataOption(data);
    return httpClient.httpRequest(searchDataOpt, callback);
};


/**
 *  @description Retrieve data from cloud through advanced API:POST/v1/api/accounts/{accountId}/data/search/advanced
 *  @param data.body the detail of the search data JSON object according to the API spec for this call 
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the account where the search is performed
 */
module.exports.searchDataAdvanced = function(data, callback) {
    var searchDataAdvancedOpt = new userAdminDef.data.SearchDataAdvancedOption(data);
    return httpClient.httpRequest(searchDataAdvancedOpt, callback);
};
