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
require('es6-shim');
var common = require("./common"),
    uuid = require('uuid');

function Sensor (store, logT) {
    var me = this;
    me.logger = logT || [];
    me.filename = store || "device.json";

    var deviceConfig = common.getDeviceConfig();
    if(deviceConfig) {
        me.data = deviceConfig['sensor_list'];
    } else {
        me.data = [];
    }
}
/**
 * It return a component looking by component id
 * @param cid
 */
Sensor.prototype.byCid = function (cid) {

    return this.data.find(function (obj) {
        return (obj.cid === cid);
    });
};
Sensor.prototype.byName = function (name) {

    return this.data.find(function (obj) {
        return (obj.name === name);
    });
};
Sensor.prototype.byType = function (type) {
    return this.data.find(function (obj) {
        return (obj.type === type);
    });
};
Sensor.prototype.add = function (sensor) {
    var me = this;
    sensor.cid = sensor.cid || uuid.v4();
    me.data.push(sensor);
    return sensor;
};
Sensor.prototype.createId = function (sensor) {
    sensor.cid = uuid.v4();
    return sensor;
};

Sensor.prototype.del = function (cid) {
    var me = this;
    var index = me.data.findIndex(function (obj) {
        return (obj.cid === cid);
    });
    if (index !== -1) {
        me.data.splice(index, 1);
    }
};
Sensor.prototype.exist = function (obj) {

    return this.data.find(function (t) {
        return ((t.name === obj.name) && (t.type === obj.type));
    });
};
Sensor.prototype.save = function() {
    var me = this;
    common.saveToDeviceConfig("sensor_list", me.data);
};

var init = function(store, loggerObj) {
    return new Sensor(store, loggerObj);
};
module.exports.init = init;
