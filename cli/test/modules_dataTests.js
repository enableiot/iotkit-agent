/*
 Copyright (c) 2017, Intel Corporation

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
    rewire = require('rewire'),
    url = require('url'),
    sinon = require('sinon'),
    GlobalConfig = require('../config');
require("./commonTest.js");

var fileToTest = "../modules/data.js";

describe(fileToTest, function() {
    var toTest = rewire(fileToTest);
    toTest.__set__("logger", logger);

    
    it('Shall try to submit data (submitData)  >', function(done) {
        var body = {
            on: on,
            accountId: account.id,
            data: [{
                componentId: cid,
                on: on,
                value: value,
                attributes: {
                    reading: "digital"
                }
            }]
        }
    
        var test = function(object, callback) {
            object.token = token;
            assert.equal(object.accountId, account.id);
            assert.equal(object.deviceId, deviceId);
            assert.equal(object.cid, cid);
            assert.deepEqual(object.body, body, "body does not match");
            callback(null, device);
            assert.equal(object.token, token, "userToken is wrong");
            assert.equal(object.username, username, "username is wrong");
            done();
        }

    
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibTools);
        toTest.__set__("Date", FakeDate);
        fakeApi.data.submitData = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("submitData")(account.id, deviceId, cid, value, jsonString);
    });


    it('Shall try to submit data without attributes (submitData)  >', function(done) {

        var body = {
            on: on,
            accountId: account.id,
            data: [
                {
                    componentId: cid,
                    on: on,
                    value: value,
                }
        
            ]
        }
    
        var test = function(object, callback) {
            object.token = token;
            assert.equal(object.accountId, account.id);
            assert.equal(object.deviceId, deviceId);
            assert.equal(object.cid, cid);
            assert.deepEqual(object.body, body, "body does not match");
            callback(null, device);
            assert.equal(object.userToken, token, "userToken is wrong");
            assert.equal(object.username, username, "username is wrong");
            done();
        }

        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibTools);
        toTest.__set__("Date", FakeDate);
        fakeApi.data.submitData = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("submitData")(account.id, deviceId, cid, value);
    });


    it('Shall return response error (submitData)  >', function(done) {
        adminDataFile = {};

        var test = function(object, callback) {
            object.token = token;
            callback(new Error("Error"));
        }

        var fakeErrorHandler = function(error, code) {
            assert.equal(code, fakeCommon.errors["responseError"].code);
            done();
        }
    
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibTools);
        fakeApi.data.submitData = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__("errorHandler", fakeErrorHandler);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("submitData")(account.id, deviceId, cid, value, jsonString);
    });
    

    it('Shall fail to get accountId (submitData)  >', function(done) {

        var fakeErrorHandler = function(error, code) {
            assert.equal(code, fakeCommon.errors["accountIdError"].code);
            done();
        }

        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibToolsError);
        fakeApi.data.submitData = function() {};
        toTest.__set__("api", fakeApi);
        toTest.__set__("errorHandler", fakeErrorHandler);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("submitData")(account.id, deviceId, cid, value, jsonString);
    });


    it('Shall fail to get deviceId (submitData)  >', function(done) {

        var fakeErrorHandler = function(error, code) {
            assert.equal(code, fakeCommon.errors["deviceIdError"].code);
            done();
        }

        var fakeLibToolsErrorDevice = Object.assign({}, fakeLibTools);
        fakeLibToolsErrorDevice.findDeviceId = fakeLibToolsError.findDeviceId;
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibToolsErrorDevice);
        fakeApi.data.submitData = function() {};
        toTest.__set__("api", fakeApi);
        toTest.__set__("errorHandler", fakeErrorHandler);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("submitData")(account.id, deviceId, cid, value, jsonString);
    });


    it('Shall fail to get cid (submitData)  >', function(done) {

        var fakeErrorHandler = function(error, code) {
            assert.equal(code, fakeCommon.errors["cidError"].code);
            done();
        }

        var fakeLibToolsErrorDevice = Object.assign({}, fakeLibTools);
        fakeLibToolsErrorDevice.findCid = fakeLibToolsError.findCid;
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibToolsErrorDevice);
        fakeApi.devices.submitData = function() {};
        toTest.__set__("api", fakeApi);
        toTest.__set__("errorHandler", fakeErrorHandler);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("submitData")(account.id, deviceId, cid, value, jsonString);
    });
    
    it('Shall return  parseJson error (submitData)  >', function(done) {

        var fakeErrorHandler = function(error, code) {
            assert.equal(code, fakeCommon.errors["parseJsonError"].code);
            done();
        }

        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibTools);
        fakeApi.data.submitData = function() {};
        toTest.__set__("api", fakeApi);
        toTest.__set__("errorHandler", fakeErrorHandler);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("submitData")(account.id, deviceId, cid, value, jsonStringError);
    });
  

    it('Shall try to submit data from file (submitDataFromFile)  >', function(done) {

        var body = {
            on: on,
            accountId: account.id,
            data: [
                {
                    componentId: cid,
                    on: on,
                    value: value,
                    attributes: {
                        reading: "digital"
                    }
                }
            ]
        }
    
        var test = function(object, callback) {
            object.token = token;
            assert.equal(object.accountId, account.id);
            assert.equal(object.deviceId, deviceId);
            assert.equal(object.cid, cid);
            assert.deepEqual(object.body, body, "body does not match");
            callback(null, device);
            assert.equal(object.userToken, token, "userToken is wrong");
            assert.equal(object.username, username, "username is wrong");
            done();
        }

        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibTools);
        toTest.__set__("Date", FakeDate);
        toTest.__set__("fs", fakeFs);
        fakeApi.data.submitData = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("submitDataFromFile")(account.id, deviceId, cid, "value.txt", jsonString);
    });


    it('Shall fail to read file (submitDataFromFile)  >', function(done) {

        var fakeErrorHandler = function(error, code) {
            assert.equal(code, fakeCommon.errors["fsError"].code);
            done();
        }

        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibTools);
        fakeApi.data.submitData = function() {};
        toTest.__set__("api", fakeApi);
        toTest.__set__("errorHandler", fakeErrorHandler);
        toTest.__set__("common", fakeCommon);
        toTest.__set__("fs", fakeFsError);
        toTest.__get__("submitDataFromFile")(account.id, deviceId, cid, "value.txt", jsonStringError);
    });


    it('Shall try to search data and save to file (searchDataToFile)  >', function(done) {
    
        var body = {
            "from": from,
            "to": to,
            "metrics": [
                {
                    "id": cid,
                    "op": "none"
                }
            ],
            "targetFilter": {
                "deviceList": [
                    deviceId
                ]
            }
        };

        var response = {
        
            "from": 1234567890,
            "to": 1234567890,
            "series": [
                {
                    "deviceId": deviceId,
                    "deviceName": deviceName,
                    "componentId": cid,
                    "componentName": component.name,
                    "componentType": component.type,                
                    "points": [
                        {"ts":9874569871, "value":25},
                        {"ts":9874569899, "value":24}
                    ]
                }        
            ]
        }

        var writeFile = sinon.spy();

        var test = function(object, callback) {
            object.token = token;
            assert.equal(object.accountId, account.id);
            assert.equal(object.deviceId, deviceId);
            assert.deepEqual(object.body, body, "body does not match");
            callback(null, response);
            assert.equal(object.userToken, token, "userToken is wrong");
            assert.equal(object.username, username, "username is wrong");
            assert.equal(writeFile.callCount, 2, "write attempts do not match");
            done();
        }

    
        fakeWriteFileSync =  function(filename, value, options) {
            if (options.encoding !== "utf8") {
                return;
            }
            if (value != 24 && value != 25) {
                return;
            }
            if (filename !== filenameToSave + ".9874569871" && filename !== filenameToSave + ".9874569899") {
                return;
            }
            writeFile();    
        }
    
        fakeFs.writeFileSync = fakeWriteFileSync;
        toTest.__set__("fs", fakeFs);
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibTools);
        fakeApi.data.searchData = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("searchDataToFile")(account.id, deviceId, cid, from, to, filenameToSave);
    });


    it('Shall try to search data and save to file with empty to and from and no points returned (searchDataToFile)  >', function(done) {
    
        var body = {
            "metrics": [
                {
                    "id": cid,
                    "op": "none"
                }
            ],
            "targetFilter": {
                "deviceList": [
                    deviceId
                ]
            }
        };

        var response = {
        
            "from": 1234567890,
            "to": 1234567890,
            "series": [
                {
                    "deviceId": deviceId,
                    "deviceName": deviceName,
                    "componentId": cid,
                    "componentName": component.name,
                    "componentType": component.type,
                }        
            ]
        }

        var writeFile = sinon.spy();

        var test = function(object, callback) {
            object.token = token;
            assert.equal(object.accountId, account.id);
            assert.equal(object.deviceId, deviceId);
            assert.deepEqual(object.body, body, "body does not match");
            callback(null, response);
            assert.equal(writeFile.callCount, 0, "write attempts do not match");
            done();
        }

    
        fakeWriteFileSync =  function(filename, value, options) {
            if (options.encoding !== "utf8") {
                return;
            }
            if (value != 24 && value != 25) {
                return;
            }
            if (filename !== filenameToSave + ".9874569871" && filename !== filenameToSave + ".9874569899") {
                return;
            }
            writeFile();    
        }
    
        fakeFs.writeFileSync = fakeWriteFileSync;
        toTest.__set__("fs", fakeFs);
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibTools);
        fakeApi.data.searchData = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("searchDataToFile")(account.id, deviceId, cid, "", "", filenameToSave);
    });


    it('Shall return response error (searchDataToFile)  >', function(done) {
        adminDataFile = {};

        var test = function(object, callback) {
            object.token = token;
            callback(new Error("Error"));
        }

        var fakeErrorHandler = function(error, code) {
            assert.equal(code, fakeCommon.errors["responseError"].code);
            done();
        }
    
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibTools);
        fakeApi.data.searchData = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__("errorHandler", fakeErrorHandler);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("searchDataToFile")(account.id, deviceId, cid, from, to, filenameToSave);
    });
    

    it('Shall fail to get accountId (searchDataToFile)  >', function(done) {

        var fakeErrorHandler = function(error, code) {
            assert.equal(code, fakeCommon.errors["accountIdError"].code);
            done();
        }

        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibToolsError);
        fakeApi.data.searchData = function() {};
        toTest.__set__("api", fakeApi);
        toTest.__set__("errorHandler", fakeErrorHandler);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("searchDataToFile")(account.id, deviceId, cid, from, to, filenameToSave);
    });


    it('Shall fail to get deviceId (searchDataToFile)  >', function(done) {

        var fakeErrorHandler = function(error, code) {
            assert.equal(code, fakeCommon.errors["deviceIdError"].code);
            done();
        }

        var fakeLibToolsErrorDevice = Object.assign({}, fakeLibTools);
        fakeLibToolsErrorDevice.findDeviceId = fakeLibToolsError.findDeviceId;
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibToolsErrorDevice);
        fakeApi.data.searchData = function() {};
        toTest.__set__("api", fakeApi);
        toTest.__set__("errorHandler", fakeErrorHandler);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("searchDataToFile")(account.id, deviceId, cid, from, to, filenameToSave);
    });


    it('Shall fail to get cid (submitData)  >', function(done) {

        var fakeErrorHandler = function(error, code) {
            assert.equal(code, fakeCommon.errors["cidError"].code);
            done();
        }

        var fakeLibToolsErrorDevice = Object.assign({}, fakeLibTools);
        fakeLibToolsErrorDevice.findCid = fakeLibToolsError.findCid;
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibToolsErrorDevice);
        fakeApi.devices.searchData = function() {};
        toTest.__set__("api", fakeApi);
        toTest.__set__("errorHandler", fakeErrorHandler);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("searchDataToFile")(account.id, deviceId, cid, from, to, filenameToSave);
    });
    

    it('Shall try to search data and save to file (searchData)  >', function(done) {
    
        var body = {
            "from": from,
            "to": to,
            "metrics": [
                {
                    "id": cid,
                    "op": "none"
                }
            ],
            "targetFilter": {
                "deviceList": [
                    deviceId
                ]
            }
        };

        var response = {
        
            "from": 1234567890,
            "to": 1234567890,
            "series": [
                {
                    "deviceId": deviceId,
                    "deviceName": deviceName,
                    "componentId": cid,
                    "componentName": component.name,
                    "componentType": component.type,                
                    "points": [
                        {"ts":9874569871, "value":25},
                        {"ts":9874569899, "value":24}
                    ]
                }        
            ]
        }

        var writeFile = sinon.spy();

        var test = function(object, callback) {
            object.token = token;
            assert.equal(object.accountId, account.id);
            assert.equal(object.deviceId, deviceId);
            assert.deepEqual(object.body, body, "body does not match");
            callback(null, response);
            assert.equal(object.userToken, token, "userToken is wrong");
            assert.equal(object.username, username, "username is wrong");
            assert.equal(writeFile.callCount, 0, "write attempts do not match");
            done();
        }

    
        fakeWriteFileSync =  function(filename, value, options) {
            if (options.encoding !== "utf8") {
                return;
            }
            if (value != 24 && value != 25) {
                return;
            }
            if (filename !== filenameToSave + ".9874569871" && filename !== filenameToSave + ".9874569899") {
                return;
            }
            writeFile();    
        }
    
        fakeFs.writeFileSync = fakeWriteFileSync;
        toTest.__set__("fs", fakeFs);
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibTools);
        fakeApi.data.searchData = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("searchData")(account.id, deviceId, cid, from, to, jsonString);
    });


    it('Shall try to search data and save to file (searchData)  >', function(done) {
    
        var body = {
            "from": from,
            "to": to,
            "metrics": [
                {
                    "id": cid,
                    "op": "none"
                }
            ],
            "targetFilter": {
                "deviceList": [
                    deviceId
                ]
            }
        };

        var response = {
        
            "from": 1234567890,
            "to": 1234567890,
            "series": [
                {
                    "deviceId": deviceId,
                    "deviceName": deviceName,
                    "componentId": cid,
                    "componentName": component.name,
                    "componentType": component.type,                
                    "points": [
                        {"ts":9874569871, "value":25},
                        {"ts":9874569899, "value":24}
                    ]
                }        
            ]
        }

        var writeFile = sinon.spy();

        var test = function(object, callback) {
            object.token = token;
            assert.equal(object.accountId, account.id);
            assert.equal(object.deviceId, deviceId);
            assert.deepEqual(object.body, body, "body does not match");
            callback(null, response);
            assert.equal(object.userToken, token, "userToken is wrong");
            assert.equal(object.username, username, "username is wrong");
            assert.equal(writeFile.callCount, 0, "write attempts do not match");
            done();
        }

    
        fakeWriteFileSync =  function(filename, value, options) {
            if (options.encoding !== "utf8") {
                return;
            }
            if (value != 24 && value != 25) {
                return;
            }
            if (filename !== filenameToSave + ".9874569871" && filename !== filenameToSave + ".9874569899") {
                return;
            }
            writeFile();    
        }
    
        fakeFs.writeFileSync = fakeWriteFileSync;
        toTest.__set__("fs", fakeFs);
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibTools);
        fakeApi.data.searchData = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("searchData")(account.id, deviceId, cid, from, to, jsonString);
    });

    it('Shall try to search advanced data and save to file (searchAdvancedDataToFile)  >', function(done) {
    
        var body = {
            "from": 1407979291860,
            "to": 1407979292860,
            "returnedMeasureAttributes": [
                "reading",
            ]
        }

        var response = {
            "msgType" : "advancedDataInquiryResponse",
            "accountId" : account.id,
            "startTimestamp" :  from,
            "endTimestamp" :  to,
            "data" : [
                {
                    "deviceId" : deviceId,
                    "deviceName" : device.name,
                    "components" : [{
                        "componentId" : cid,
                        "componentType" : component.type,
                        "componentName" : component.name,
                        "samplesHeader" : ["Timestamp", "Value", "reading"],
                        "samples" : [
                            ["9874569871", "25","digital"],
                            ["9874569899", "24", "analogue"]
                        ]
                    }]
                }
            ]
        }

        var writeFile = sinon.spy();

        var test = function(object, callback) {
            assert.equal(object.accountId, account.id);
            assert.deepEqual(object.body, body, "body does not match");
            callback(null, response);
            assert.equal(object.userToken, token, "userToken is wrong");
            assert.equal(object.username, username, "username is wrong");
            assert.equal(writeFile.callCount, 2, "write attempts do not match");
            done();
        }

    
        fakeWriteFileSync =  function(filename, value, options) {
            if (options.encoding !== "utf8") {
                return;
            }
            if (value != 24 && value != 25) {
                return;
            }
            if (filename !== filenameToSave + ".9874569871" && filename !== filenameToSave + ".9874569899") {
                return;
            }
            writeFile();    
        }
    
        fakeFs.writeFileSync = fakeWriteFileSync;
        toTest.__set__("fs", fakeFs);
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibTools);
        fakeApi.data.searchDataAdvanced = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("searchDataAdvancedToFile")(account.id, from, to, filenameToSave, jsonStringSearchAdvanced);
    });


    it('Shall try to search advanced data and save to file w/o jsonString, from and to field (searchAdvancedDataToFile)  >', function(done) {

        var response = {
            "msgType" : "advancedDataInquiryResponse",
            "accountId" : account.id,
            "startTimestamp" :  from,
            "endTimestamp" :  to,
            "data" : [
                {
                    "deviceId" : deviceId,
                    "deviceName" : device.name,
                    "components" : [{
                        "componentId" : cid,
                        "componentType" : component.type,
                        "componentName" : component.name,
                        "samplesHeader" : ["Timestamp", "Value", "reading"]
                    }]
                }
            ]
        }

        var writeFile = sinon.spy();

        var test = function(object, callback) {
            assert.equal(object.accountId, account.id);
            assert.isUndefined(object.body, "body should not exist");
            callback(null, response);
            assert.equal(writeFile.callCount, 0, "write attempts do not match");
            done();
        }

    
        fakeWriteFileSync =  function(filename, value, options) {
            if (options.encoding !== "utf8") {
                return;
            }
            if (value != 24 && value != 25) {
                return;
            }
            if (filename !== filenameToSave + ".9874569871" && filename !== filenameToSave + ".9874569899") {
                return;
            }
            writeFile();    
        }
    
        fakeFs.writeFileSync = fakeWriteFileSync;
        toTest.__set__("fs", fakeFs);
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibTools);
        fakeApi.data.searchDataAdvanced = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("searchDataAdvancedToFile")(account.id, "", "", filenameToSave);
    });


    it('Shall try to search advanced data and save to file w/o response.data (searchAdvancedDataToFile)  >', function(done) {

        var response = {
            "msgType" : "advancedDataInquiryResponse",
            "accountId" : account.id,
            "startTimestamp" :  from,
            "endTimestamp" :  to
        }

        var writeFile = sinon.spy();

        var test = function(object, callback) {
            assert.equal(object.accountId, account.id);
            assert.isUndefined(object.body, "body should not exist");
            callback(null, response);
            assert.equal(writeFile.callCount, 0, "write attempts do not match");
            done();
        }

    
        fakeWriteFileSync =  function(filename, value, options) {
            if (options.encoding !== "utf8") {
                return;
            }
            if (value != 24 && value != 25) {
                return;
            }
            if (filename !== filenameToSave + ".9874569871" && filename !== filenameToSave + ".9874569899") {
                return;
            }
            writeFile();    
        }
    
        fakeFs.writeFileSync = fakeWriteFileSync;
        toTest.__set__("fs", fakeFs);
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibTools);
        fakeApi.data.searchDataAdvanced = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("searchDataAdvancedToFile")(account.id, "", "", filenameToSave);
    });


    it('Shall try to search advanced data and save to file w/o components (searchAdvancedDataToFile)  >', function(done) {

        var response = {
            "msgType" : "advancedDataInquiryResponse",
            "accountId" : account.id,
            "startTimestamp" :  from,
            "endTimestamp" :  to,
            "data" : [
                {
                    "deviceId" : deviceId,
                    "deviceName" : device.name,
                }
            ]
        }

        var writeFile = sinon.spy();

        var test = function(object, callback) {
            assert.equal(object.accountId, account.id);
            assert.isUndefined(object.body, "body should not exist");
            callback(null, response);
            assert.equal(writeFile.callCount, 0, "write attempts do not match");
            done();
        }

    
        fakeWriteFileSync =  function(filename, value, options) {
            if (options.encoding !== "utf8") {
                return;
            }
            if (value != 24 && value != 25) {
                return;
            }
            if (filename !== filenameToSave + ".9874569871" && filename !== filenameToSave + ".9874569899") {
                return;
            }
            writeFile();    
        }
    
        fakeFs.writeFileSync = fakeWriteFileSync;
        toTest.__set__("fs", fakeFs);
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibTools);
        fakeApi.data.searchDataAdvanced = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("searchDataAdvancedToFile")(account.id, "", "", filenameToSave);
    });


    it('Shall return response error (searchDataAdvancedToFile)  >', function(done) {
        adminDataFile = {};

        var test = function(object, callback) {
            object.token = token;
            callback(new Error("Error"));
        }

        var fakeErrorHandler = function(error, code) {
            assert.equal(code, fakeCommon.errors["responseError"].code, "wrong error code");
            done();
        }
    
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibTools);
        fakeApi.data.searchDataAdvanced = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__("errorHandler", fakeErrorHandler);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("searchDataAdvancedToFile")(account.id, from, to, filenameToSave, jsonStringSearchAdvanced);
    });
    

    it('Shall fail to get accountId (searchDataAdvancedToFile)  >', function(done) {

        var fakeErrorHandler = function(error, code) {
            assert.equal(code, fakeCommon.errors["accountIdError"].code);
            done();
        }

        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibToolsError);
        fakeApi.data.searchDataAdvanced = function() {};
        toTest.__set__("api", fakeApi);
        toTest.__set__("errorHandler", fakeErrorHandler);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("searchDataAdvancedToFile")(account.id, from, to, filenameToSave, jsonStringSearchAdvanced);
    });


    it('Shall return  parseJson error (searchDataAdvancedToFile)  >', function(done) {

        var fakeErrorHandler = function(error, code) {
            assert.equal(code, fakeCommon.errors["parseJsonError"].code);
            done();
        }

        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__("userAdminTools", fakeLibTools);
        fakeApi.data.searchDataAdvanced = function() {};
        toTest.__set__("api", fakeApi);
        toTest.__set__("errorHandler", fakeErrorHandler);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("searchDataAdvancedToFile")(account.id, from, to, filenameToSave, jsonStringError);
    });
    
    
    it('Shall add command for devices.js   >', function(done) {
        var program = {};
        var errorHandler = function() {
            return 1;
        };
        var command = sinon.spy();
        program.command = function(x) {
            command();return this;
        }
        var description = sinon.spy();
        program.description = function(x) {
            description(); return this;
        }
        var action = sinon.spy();
        program.action = function(x) {
            action(); return this;
        }
        toTest.addCommand(program, errorHandler);
        assert.equal(command.callCount, 5);
        assert.equal(description.callCount, 5);
        assert.equal(action.callCount, 5);
        assert.deepEqual(toTest.__get__("errorHandler"), errorHandler,"wrong error handler");
        done();
    });
    
});
