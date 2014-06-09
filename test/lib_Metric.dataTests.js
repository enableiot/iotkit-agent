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

var assert =  require('chai').assert,
    rewire = require('rewire');
var fileToTest = "../lib/data/Metric.data.js";

describe(fileToTest, function(){
    var toTest = rewire(fileToTest);
    var util = {
        data: 10234566789,
        newTimeStamp:  function () {
                return this.data;
        }
    };
    it('Shall Return Metric empty Object >', function(done) {
        var Metric  = toTest.init(util)
        var mMet = new Metric()
        assert.property(mMet, "accountId" , "The account id is required by MQTT AA");
        assert.property(mMet, "did", "The did (device) is require by MQTT AA");
        assert.property(mMet, "on", "The on (epoch time) is require by MQTT AA");
        assert.property(mMet, "count", "The count is require by MQTT AA");
        assert.equal(mMet.on, util.data, "The on is not the expected");
        assert.isArray(mMet.data, "The Data Array were not proper initialized");
        done();
    });
    it('Shall Return Metric Object with Name a Value >', function(done) {
        var Metric  = toTest.init(util)
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
        assert.equal(mMet.on, util.data, "The on is not the expected");
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
    it('Shall Convert Metric Obj to MQTT >', function(done) {
        var Metric  = toTest.init(util)
        var mMetricon = new Metric();
        var message = {
            accountId: "myAccount2",
            componentId: "111-2223-5556-77877",
            deviceId: "myDeviceID_clear",
            on: "10101010",
            v: "10.32",
            loc: [10, 20, 30]
        };
        mMetricon.set(message);
        mMetricon.convertToMQTTPayload();
        assert.equal(mMetricon.on, message.on, "The on is not the expected");
        assert.isArray(mMetricon.data, "The Data Array were not proper initialized");
        assert.lengthOf(mMetricon.data, 1, "The length of data is not the expected");
        d = mMetricon.data[0];
        assert.equal(d.value, message.v, "The length of data is not the expected");
        assert.equal(d.on, message.on, "The length of data is not the expected");
        assert.equal(d.cid, message.componentId, "The length of data is not the expected");
        assert.notProperty(d, "attributes", "The attributes are not expected");
        assert.notProperty(d, "globalCid", "Temporal Property not remove");
        assert.lengthOf(mMetricon.data, mMetricon.count, "The length of data is not the expected");

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
        mMetricon.convertToMQTTPayload();
        assert.equal(mMetricon.on, util.data, "The on is not the expected");
        assert.isArray(mMetricon.data, "The Data Array were not proper initialized");
        assert.lengthOf(mMetricon.data, 1, "The length of data is not the expected");
        assert.notProperty(mMetricon, "globalCid", "The attributes are not expected");
        d = mMetricon.data[0];
        assert.isString(d.value, "The value of the data is not string");
        assert.equal(d.value, message.v, "The data is not the expected");
        assert.equal(d.on, util.data, "The on time is not the expected");
        assert.equal(d.cid, message.componentId, "The length of data is not the expected");
        assert.equal(d.attributes, message.attributes, "The attributes are not expected");
        assert.notProperty(d, "globalCid", "Temporal Property not remove");
        assert.lengthOf(mMetricon.data, mMetricon.count, "The length of data is not the expected");

        done();
   });
    it('Shall Convert Metric Obj to MQTT with a multiple data>', function(done) {
        var Metric  = toTest.init(util)
        var mMetricon = new Metric();
        var message = {
            accountId: "myAccount2",
            deviceId: "myDeviceID_clear",
            data: [ {
                componentId: "111-2223-5556-77877",
                on: "101020202",
                v: "10.32",
                loc: [10, 20, 30]
            }, {
                componentId: "0909090917",
                on: "101013213213202",
                v: "10.32",
                attributes: "some value"
            }]
        };
        mMetricon.set(message);
        assert.equal(mMetricon.on, util.data, "The on is not the expected");
        assert.isArray(mMetricon.data, "The Data Array were not proper initialized");
        assert.lengthOf(mMetricon.data, mMetricon.count, "The length of data is not the expected");
        var d = mMetricon.data[0];
        var d1 = message.data[0];
        assert.equal(d.value, d1.v, "The length of data is not the expected");
        assert.equal(d.on, d1.on, "The length of data is not the expected");
        assert.equal(d.cid, d1.componentId, "The length of data is not the expected");
        assert.equal(d.loc, d1.loc, "The loc are not expected");
        assert.notProperty(d, "attributes", "Temporal Property not remove");
        assert.notProperty(d, "globalCid", "Temporal Property not remove");
        d = mMetricon.data[1];
        var d2 = message.data[1];
        assert.equal(d.value, d2.v, "The length of data is not the expected");
        assert.equal(d.on, d2.on, "The length of data is not the expected");
        assert.equal(d.cid, d2.componentId, "The length of data is not the expected");
        assert.equal(d.attributes, d2.attributes, "The loc are not expected");
        assert.notProperty(d, "loc", "Temporal Property not remove");
        assert.notProperty(d, "globalCid", "Temporal Property not remove");

        done();
    });
    it('Shall Convert Metric Obj to Rest Payload >', function(done) {
        var Metric  = toTest.init(util)
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
        assert.equal(mMetricon.on, util.data, "The on is not the expected");
        assert.isArray(mMetricon.data, "The Data Array were not proper initialized");
        assert.lengthOf(mMetricon.data, 1, "The length of data is not the expected");
        assert.notProperty(mMetricon, "globalCid", "The attributes are not expected");
        d = mMetricon.data[0];
        assert.isString(d.value, "The value of the data is not string");
        assert.equal(d.value, message.v, "The data is not the expected");
        assert.equal(d.on, util.data, "The on time is not the expected");
        assert.equal(d.componentId, message.componentId, "The length of data is not the expected");
        assert.equal(d.attributes, message.attributes, "The attributes are not expected");
        assert.notProperty(d, "cid", "The property is bad named");
        assert.notProperty(d, "globalCid", "Temporal Property not remove");
        assert.notProperty(d, "count", "Temporal Property not remove");
        assert.notProperty(d, "globalCid", "Temporal Property not remove");
        done();
    });
    /*it('Shall Convert Metric Obj to MQTT using Data Array>', function(done) {
        var Metric  = toTest.init(util);
        var mMetricon = new Metric();
        var message = {
            accountId: "myAccount",
            on : 111122223334544566,
            deviceId: "myDeviceID",
            data: [{v: "myDDDD",
                    componentId: "000-2223-5556-77877",
                    on: 2222345565
                    },
                    {value: "valueDDDD",
                     cid: "000-2223-5556-77877",
                     loc: [1,2,4,5,6],
                     attributes: {v:'xx'}
                    }
                    ]
        };
        var mMet = mMetricon.convertToMQTTPayload(message);
        assert.equal(mMet.on, message.on, "The on is not the expected");
        assert.isArray(mMet.data, "The Data Array were not proper initialized");
        assert.lengthOf(mMet.data, message.data.length, "The length of data is not the expected");
        d = mMet.data[0];
        assert.equal(d.value, message.data[0].v, "The length of data is not the expected");
        assert.equal(d.on, message.data[0].on, "The length of data is not the expected");
        assert.equal(d.cid, message.data[0].componentId, "The length of data is not the expected");
        assert.notProperty(d, "attributes", "The attributes are not expected");
        assert.notProperty(d, "loc", "The loc are not expected");
        assert.lengthOf(mMet.data, mMet.count, "The length of data is not the expected");
        d = mMet.data[1];
        assert.equal(d.value, message.data[1].value, "The length of data is not the expected");
        assert.equal(d.on, message.on, "The length of data is not the expected");
        assert.equal(d.cid, message.data[1].cid, "The length of data is not the expected");
        assert.property(d, "attributes", "The attributes are not expected");
        assert.property(d, "loc", "The loc are not expected");
        assert.deepEqual(d.loc, message.data[1].loc, "The loc are not expected");
        assert.deepEqual(d.attributes, message.data[1].attributes, "The loc are not expected");
        assert.lengthOf(mMet.data, mMet.count, "The length of data is not the expected");

        done();
    });*/
});
