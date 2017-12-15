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

var fileToTest = "../api/rest/iot.devices.js";

describe(fileToTest, function() {
    var toTest = rewire(fileToTest);
    var logger  = {
        info : function() {},
        error : function() {},
        debug : function() {}
    };
    console.debug = function() {
        console.log(arguments);
    };

    var Option = {
        DeviceActivateOption:{},
        DeviceMetadataOption: {},
        DeviceComponentOption: {}
    };
    var httpClientMock = {
        httpRequest : {},
        httpClient: {}
    };
    var responseData = {
        statusCode : 200,
        data : ""
    };

    it('Shall Register and Control the Response from device Registration >', function(done) {

        var optData = {
            method: 'PUT',
            host: "myhost",
            body: "mybody"
        };

        var data = {deviceid : "did",
                    body: { data: "message" }
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "223"]
        };

        Option.DeviceActivateOption = function (device) {
            assert.deepEqual(device, data, "The Data is not oki");
            return optData;
        };
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the option object were missed");
            cb(reData);
        };
        var callBack = function (response) {
            assert.isNotNull(response, "The Response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        };
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("adminDef.devices", Option);
        toTest.registerDevice(data, callBack);
    });
    it('Shall Sent Update Data To Server >', function(done) {
        var optData = {
            method: 'PUT',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            deviceid : "did",
            body: { data: "message" }
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "223"]
        };

        Option.DeviceMetadataOption = function (device) {
            assert.deepEqual(device, data, "The Data is not oki");
            return optData;
        };
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the option object were missed");
            cb(reData);
        };

        var callBack = function (response) {
            assert.isNotNull(response, "The Response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        };
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("adminDef.devices", Option);
        toTest.updateMetadataDevice(data, callBack);

    });
    it('Shall Sent Component Registration To Server >', function(done) {
        var optData = {
            method: 'POST',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            deviceId : "did",
            body: { data: "message" }
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "223"]
        };

        Option.DeviceComponentOption = function (device) {
            assert.deepEqual(device, data, "The Data is not the expected");
            return optData;
        };
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the option object were missed");
            cb(null, reData);
        };

        var callBack = function (error, response) {
            console.log("Marcel: error", error);
            assert.isNull(error, "An expected Error is detected");
            assert.isArray(response, "The Response were missing");
            assert.deepEqual(response[0], reData, "The Data were missing");
            done();
        };
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("adminDef.devices", Option);
        var dataClone = JSON.parse(JSON.stringify(data));
        toTest.registerComponents(dataClone, callBack);

    });
    it('Shall Return an Error in a fail Registration To Server >', function(done) {
        var optData = {
            method: 'POST',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            deviceId : "did",
            body: { data: "message" }
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "223"]
        };

        Option.DeviceComponentOption = function (device) {
            assert.deepEqual(device, data, "The Data is not the expected");
            return optData;
        };
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the option object were missed");
            var er = new Error("Invalid Component");
            cb(er);
        };

        var callBack = function (error, response) {
            assert.instanceOf(error, Error, "An expected Error is detected");
            assert.isArray(response, "The Response were missing");
            done();
        };
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("adminDef.devices", Option);
        var dataClone = JSON.parse(JSON.stringify(data));
        toTest.registerComponents(dataClone, callBack);

    });
});
