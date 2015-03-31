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
var AdminDef = require('./admin.def');
var CatalogDef = require('./component.def');
var ActuationsDef = require('./actuations.def');

/**
 * It passes to a callback the access token
 */
module.exports.health = function(callback) {
    var health = new AdminDef.HealthOption();
    return httpClient.httpRequest(health, callback);
};
module.exports.getCatalog = function (data, callback) {
    var catalog = new CatalogDef.CatalogOption(data);
    return httpClient.httpRequest(catalog, callback);
};
module.exports.pullActuations = function (data, callback) {
    var actuations = new ActuationsDef.ActuationsOption(data);
    return httpClient.httpRequest(actuations, callback);
};
module.exports.getExternalInfo = function (callback) {
    var external = new AdminDef.ExternalInfoOption();
    return httpClient.httpRequest(external, callback);
};
module.exports.getActualTime = function (callback) {
    var time = new AdminDef.TimeOption();
    return httpClient.httpRequest(time, callback);
};