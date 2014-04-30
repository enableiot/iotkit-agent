/**
 * Created by ammarch on 4/30/14.
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
    this.ttl = 0;

}

Metric.prototype.dataAsRoot = function (value) {
    var dataTemporal = {
        "cid": value.componentId || value.cid || this.globalCid,
        "on": value.on || this.on,
        "value": value.v
    };
    if (value.loc){
        dataTemporal.loc = value.loc;
    }
    if (value.attributes) {
        dataTemporal.attributes = value.attributes;
    }
    this.data.push(dataTemporal);
};
Metric.prototype.dataAsArray = function (msg) {
    var l = msg.data.length;
    this.globalCid =  msg.cid;
    for (var i = 0; i < l; i++) {
        var value = msg.data[i];
        this.dataAsRoot(value);
    }
};

/**
 * This convert the Mesagge at Analitics RT to Adavance Analytics Data Injection Payload
 * @param msg
 * @returns {Metric}
 */
Metric.prototype.convertToMQTTPayload= function(msg) {
    this.accountId = msg.accountId || msg.domainId;
    this.did = msg.deviceId;
    this.on = msg.on || this.on;

    if (Array.isArray(msg.data)) {
        this.dataAsArray(msg);
    } else {
        this.dataAsRoot(msg);
    }
    this.count = this.data.length;
    return this;
};

module.exports.init = function (Util) {
  dateUtil = Util;
  return Metric;
};
