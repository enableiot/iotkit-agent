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
var url = require('url'),
    config = require('../../config');


var apiconf = config.connector.rest;
/**
 * Top of the hierarchy. Common attributes to every
 * Connection Options
 */
function ConnectionOptions() {
    if (apiconf.proxy && apiconf.proxy.host) {
        if(apiconf.proxy.host.indexOf('://') < 0) {
            apiconf.proxy.host = 'http://' + apiconf.proxy.host;
        }
        this.proxy = apiconf.proxy.host + ":" + apiconf.proxy.port;
    } else if(process.env.https_proxy) {
        this.proxy = process.env.https_proxy;
    } else if(process.env.http_proxy) {
        this.proxy = process.env.http_proxy;
    }
    var urlT =  {
        hostname: apiconf.host,
        port: apiconf.port,
        pathname: this.pathname,
        protocol: apiconf.protocol,
        query: this.query
    };
    if (apiconf.strictSSL === false) {
        this.strictSSL = false;
    }
    this.timeout = apiconf.timeout;
    this.url = url.format(urlT);
    this.headers = {
        "Content-type" : "application/json"
    };
    if (this.token) {
        this.headers["Authorization"] = "Bearer " + this.token;
    }
    delete this.token;
}

module.exports = ConnectionOptions;
