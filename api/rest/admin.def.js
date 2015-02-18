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
var url = require('url');

var ConnectionOptions = require('./iot.connection.def.js');
var GET_METHOD = 'GET';

var apiconf = config.connector.rest;

//variable to be returned
var IoTKiT = {};
/**
 * Connection attributes to redirect to Intel Itendtity Main Page
 */
function HealthOption() {
    this.pathname = apiconf.path.health;
    this.token = null;
    ConnectionOptions.call(this);
    this.method = GET_METHOD;
}
HealthOption.prototype = new ConnectionOptions();
HealthOption.prototype.constructor = HealthOption;
IoTKiT.HealthOption = HealthOption;

function ExternalInfoOption() {
    this.pathname = '';
    this.token = null;
    ConnectionOptions.call(this);
    var urlT =  {
            hostname: 'ipinfo.io',
            port: 80,
            protocol: 'http'
    };
    this.url = url.format(urlT);
    this.method = GET_METHOD;
}
ExternalInfoOption.prototype = new ConnectionOptions();
ExternalInfoOption.prototype.constructor = ExternalInfoOption;
IoTKiT.ExternalInfoOption = ExternalInfoOption;

function TimeOption() {
    this.pathname = apiconf.path.time;
    this.token = null;
    ConnectionOptions.call(this);
    this.method = GET_METHOD;
}
TimeOption.prototype = new ConnectionOptions();
TimeOption.prototype.constructor = TimeOption;
IoTKiT.TimeOption = TimeOption;

module.exports = IoTKiT;
