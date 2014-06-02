/**
 * Created by ammarch on 4/30/14.
 */
"use strict";
var dataAttrUtil;
var dateUtil;
/**
 * Interface to manage the Metric Payload require by Advances Analytics.
 * @constructor
 */
function Attributes () {
    this.on = dateUtil.newTimeStamp();
    this.gatewayId = null;
    this.deviceId = null;
    this.loc =  dataAttrUtil.getLocation();
    this.attributes =  dataAttrUtil.getAgentAttr();
}


Attributes.prototype.forToMQTTPayload = function () {

};

Attributes.prototype.fromMQTTToRest = function () {

};




module.exports.init = function (dateCom, dataExtComp) {
    dateUtil = dateCom;
    dataAttrUtil = dataExtComp;
    return Attributes;
};
