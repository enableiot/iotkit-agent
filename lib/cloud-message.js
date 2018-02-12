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
var util = require('./utils').init();

/**
 *
 * @param deviceId
 * @param gatewayId
 * @constructor
 */
module.exports.Metadata = function Metadata (gatewayId) {
    this.gatewayId = gatewayId ;
    this.loc =  util.getLocation();
    this.attributes =  util.getAgentAttr();
};

module.exports.metadataExtended = function  (gatewayId, callback) {
    /*
        It's retrieve the external info.
     */
    var att = {
        attributes :  util.getAgentAttr(),
        gatewayId : gatewayId
    };
    callback(att);
    /* util.externalInfo(function (data) {
        if (data) {
            att.loc = data.loc.split(',');
            att.loc = att.loc.map(function (od){
                            return parseInt(od);
                        });
            //att.tags = [data.region, data.country];
        } else {
            att.loc = util.getLocation();
        }
        callback(att);
    });
    */
};
