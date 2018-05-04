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

var assert =  require('chai').assert,
    rewire = require('rewire');
var fileToTest = "../lib/data/Metric.data.js";

describe(fileToTest, function() {
    var toTest = rewire(fileToTest);
    var startData = Date.now();
    it('Shall Return Metric empty Object >', function(done) {
        var Metric  = toTest.init();
        var mMet = new Metric();
        assert.property(mMet, "accountId" , "The account id is required AA");
        assert.property(mMet, "did", "The did (device) is required AA");
        assert.property(mMet, "on", "The on (epoch time) is required AA");
        assert.property(mMet, "count", "The count is required AA");
        assert.operator(mMet.on, '>=', startData, "The on is not the expected");
        assert.isArray(mMet.data, "The Data Array were not proper initialized");
        done();
    });
    it('Shall Return Metric Object with Name a Value >', function(done) {
        var Metric  = toTest.init();
        var mMet = new Metric();
        var message = {
            accountId: "myAccount",
            componentId: "000-2223-5556-77877",
            deviceId: "myDeviceID",
            v: "myDDDD"
        };
        mMet.set(message);
        assert.equal(mMet.accountId, message.accountId , "The account id is missing");
        assert.equal(mMet.did, message.deviceId, "The Deviceid is missing");
        assert.operator(mMet.on, '>=', startData, "The on is not the expected");
        assert.isArray(mMet.data, "The Data Array were not proper initialized");
        delete  mMet;
        mMet = new Metric();
        var message = {
            accountId: "myAccount",
            componentId: "000-2223-5556-77877",
            deviceId: "myDeviceID",
            on: "101022",
            value: "pepepe"
        };
        mMet.set(message);

        assert.equal(mMet.accountId, message.accountId , "The account id is missing");
        assert.equal(mMet.did, message.deviceId, "The Deviceid is missing");
        assert.equal(mMet.on, message.on, "The on is not the expected");
        assert.isArray(mMet.data, "The Data Array were not proper initialized");
        d = mMet.data[0];
        assert.equal(d.value, message.value, "The length of data is not the expected");
        assert.equal(d.on, message.on, "The length of data is not the expected");
        assert.equal(d.cid, message.componentId, "The length of data is not the expected");

        done();
    });
    it('Shall Convert Metric Obj to Rest Payload >', function(done) {
        var Metric  = toTest.init();
        var mMetricon = new Metric();
        var message = {
            accountId: "myAccount2",
            componentId: "111-2223-5556-77877",
            deviceId: "myDeviceID_clear",
            on: "10101010",
            v: "10.32",
            loc: [10, 20, 30]
        };
        mMetricon.set(message)
        mMetricon.convertToRestPayload();
        assert.equal(mMetricon.on, message.on, "The on is not the expected");
        assert.isArray(mMetricon.data, "The Data Array were not proper initialized");
        assert.lengthOf(mMetricon.data, 1, "The length of data is not the expected");
        d = mMetricon.data[0];
        assert.equal(d.value, message.v, "The length of data is not the expected");
        assert.equal(d.on, message.on, "The length of data is not the expected");
        assert.equal(d.componentId, message.componentId, "The length of data is not the expected");
        assert.notProperty(d, "cid", "The property is bad named");
        assert.notProperty(d, "attributes", "The attributes are not expected");
        assert.notProperty(d, "globalCid", "Temporal Property not remove");
        assert.notProperty(d, "count", "Temporal Property not remove");

        message = {
            accountId: "myAccount2",
            componentId: "111-2223-5556-77877",
            deviceId: "myDeviceID_clear",
            v: "122.32",
            attributes: "shome value"
        };
        delete  mMetricon;
        mMetricon = new Metric();
        mMetricon.set(message);
        mMetricon.convertToRestPayload();
        assert.operator(mMetricon.on, '>=', startData, "The on is not the expected");
        assert.isArray(mMetricon.data, "The Data Array were not proper initialized");
        assert.lengthOf(mMetricon.data, 1, "The length of data is not the expected");
        assert.notProperty(mMetricon, "globalCid", "The attributes are not expected");
        d = mMetricon.data[0];
        assert.isString(d.value, "The value of the data is not string");
        assert.equal(d.value, message.v, "The data is not the expected");
        assert.operator(d.on, '>=', startData, "The on is not the expected");
        assert.equal(d.componentId, message.componentId, "The length of data is not the expected");
        assert.equal(d.attributes, message.attributes, "The attributes are not expected");
        assert.notProperty(d, "cid", "The property is bad named");
        assert.notProperty(d, "globalCid", "Temporal Property not remove");
        assert.notProperty(d, "count", "Temporal Property not remove");
        assert.notProperty(d, "globalCid", "Temporal Property not remove");
        done();
    });
});
