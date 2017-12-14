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
 *  @description Get user token through API:POST/v1/api/auth/token
 *  @param data.body.email the user email 
 *  @param data.body.password the user password
 */
module.exports.getAuthToken = function(data, callback) {
    var getAuthTokenOpt = new userAdminDef.auth.GetAuthTokenOption(data);
    return httpClient.httpRequest(getAuthTokenOpt, callback);
};


/**
 *  @description Get user token through API:GET/v1/api/auth/tokenInfo
 *  @param data.token the access token
 */
module.exports.getAuthTokenInfo = function(data, callback) {
    var getAuthTokenInfoOpt = new userAdminDef.auth.GetAuthTokenInfoOption(data);
    return httpClient.httpRequest(getAuthTokenInfoOpt, callback);
};


/**
 *  @description Get information about the JWT owner through API:GET/v1/api/auth/me
 *  @param data contains the auth token
 */
module.exports.getAuthUserInfo = function(data, callback) {
    var getAuthUserInfoOpt = new userAdminDef.auth.GetAuthUserInfoOption(data);
    return httpClient.httpRequest(getAuthUserInfoOpt, callback);
};


