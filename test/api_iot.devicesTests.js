/**
 * Created by ammarch on 4/14/14.
 */
var assert =  require('chai').assert,
    rewire = require('rewire');

var fileToTest = "../api/rest/iot.devices.js";

describe(fileToTest, function(){
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
        DeviceMetadataOption: {}
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
        }
        var callBack = function (response) {
            assert.isNotNull(response, "The Response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        };
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("DeviceDef", Option);
        toTest.registerDevice(data, callBack);
    });
    it('Shall Sent Update Data To Server >', function(done){
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
        toTest.__set__("DeviceDef", Option);
        toTest.updateMetadataDevice(data, callBack);

    });
});
