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
var config = require('../../config');
var common = require('../../lib/common');

var ConnectionOptions = require('./iot.connection.def.js');

var POST_METHOD = 'POST';

var apiconf = config.connector.rest;

//variable to be returned
var IoTKiT = {};


function SubmitDataOption(data) {
    this.pathname = common.buildPath(apiconf.path.data.send, data.deviceId);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = POST_METHOD;
    this.body =  JSON.stringify(data.body);
}
SubmitDataOption.prototype = new ConnectionOptions();
SubmitDataOption.prototype.constructor = SubmitDataOption;
IoTKiT.SubmitDataOption = SubmitDataOption;


function SearchDataOption(data) {
    this.pathname = common.buildPath(apiconf.path.data.search, data.accountId);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = POST_METHOD;
    this.body =  JSON.stringify(data.body);
}
SearchDataOption.prototype = new ConnectionOptions();
SearchDataOption.prototype.constructor = SearchDataOption;
IoTKiT.SearchDataOption = SearchDataOption;


function SearchDataAdvancedOption(data) {
    this.pathname = common.buildPath(apiconf.path.data.advanced, data.accountId);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = POST_METHOD;
    this.body =  JSON.stringify(data.body);
}
SearchDataAdvancedOption.prototype = new ConnectionOptions();
SearchDataAdvancedOption.prototype.constructor = SearchDataAdvancedOption;
IoTKiT.SearchDataAdvancedOption = SearchDataAdvancedOption;


module.exports = IoTKiT;
