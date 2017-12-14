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
/**
 *
 * @param options object that contains attributes of the connection
 * @param callback function to be called at the end of the request
 * @param useHttp if true, it sends a HTTP request, If not, it uses a
 * HTTPS request
 */
var request = require('request');

function processResponse(res, body, callback) {
    var data = null;
    if (res.statusCode === 200 || res.statusCode === 201) {
        if (body) {// if body not defined, the statusCode should be returned instead. Empty body is allowed for stauscode:200
            if (res.headers['content-type'] && res.headers['content-type'].indexOf('application/json') > -1) {
                try {
                    data = JSON.parse(body);
                } catch (e) {
                    data = null;
                }
            } else {
                data = null;
            }
        } else { // no body, don't try to parse it
            data = {
                status: "OK",
                code: res.statusCode
            };
        }
    } else if (res.statusCode === 204) {
        data = {
            status: "Done"
        };
    }
    return  callback(data);
}

module.exports.httpRequest = function createRequest (options, callback) {
    return request(options, function (error, response, body) {
        if (!error && (response.statusCode === 200 ||
                       response.statusCode === 201 ||
                       response.statusCode === 204)) {
            processResponse(response, body, function (data) {
                return callback(null, data);
            });
        } else {
            error = error || body;
            return callback(error);
        }
    });
};
