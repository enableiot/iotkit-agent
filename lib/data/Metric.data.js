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
var dateUtil;
/**
 * Interface to manage the Metric Payload require by Advances Analytics.
 * @constructor
 */
function Metric () {
    this.accountId = null;
    this.did  = null;
    this.on = dateUtil.newTimeStamp();
    this.count = 0;
    this.data = [];
}
Metric.prototype.dataAsRoot = function (value) {

    var cid = this.nameOfComponentId || "cid";
    var theValue = value.v || value.value || "0";
    var dataTemporal = {
        "on": value.on || this.on,
        "value": theValue.toString() //Conversion since JSON schema required.
    };
    dataTemporal[cid] = value.componentId || value.cid || this.globalCid;
    if (value.loc) {
        dataTemporal.loc = value.loc;
    }
    if (value.attributes) {
        dataTemporal.attributes = value.attributes;
    }
    this.data.push(dataTemporal);
};
Metric.prototype.dataAsArray = function (msg) {
    var l = msg.data.length;
    this.globalCid = msg.cid || this.componentId ;
    for (var i = 0; i < l; i++) {
        var value = msg.data[i];
        this.dataAsRoot(value);
    }
};
Metric.prototype.dataProcess = function (datoArr) {
    if (datoArr) {
        if (Array.isArray(datoArr.data)) {
            this.dataAsArray(datoArr);
        } else {
            this.dataAsRoot(datoArr);
        }
    }
};
Metric.prototype.set = function (data) {
    this.accountId = data.accountId || data.domainId;
    this.did = data.deviceId;
    this.on = data.on || this.on;
    this.data = [];
    this.dataProcess(data);
    this.count = this.data.length;
};
/**
 * This convert the Message at Analitics RT to Adavance Analytics Data Injection Payload
 * @param msg
 * @returns {Metric}
 */
Metric.prototype.convertToMQTTPayload = function() {
    this.dataProcess();
    this.count = this.data.length;
    return this;
};
Metric.prototype.convertToRestPayload = function() {
    this.nameOfComponentId = "componentId";
    this.dataProcess();
    /**
     * Since the schema validation of Rest Interface if so hard
     * it is removed the none require parameter
     */
    this.data.forEach(function (ob){
        if (ob.cid) {
            ob.componentId = ob.cid;
            delete ob.cid;
        }
    });

    delete this.did;
    delete this.count;
    delete this.nameOfComponentId;
    delete this.globalCid;
    return this;
};
/*
Metric.prototype.fromMQTTToRestPayload = function(msg) {
    this.on = msg.on || this.on;
    this.accountId = msg.accountId;
    this.data = [];
    this.nameOfComponentId = "componentId";
    if (Array.isArray(msg.data)) {
        this.dataAsArray(msg);
    } else {
        this.dataAsRoot(msg);
    }
    *//*
    Since the health require de account id it will  not delete
    *//*

    *//**
     * Since the schema validation of Rest Interface if so hard
     * it is removed the none require parameter
     *//*
    delete this.did;
    delete this.count;
    delete this.nameOfComponentId;
    return this;
};*/
module.exports.init = function (Util) {
  dateUtil = Util;
  return Metric;
};
