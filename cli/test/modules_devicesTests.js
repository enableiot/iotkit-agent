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
    sinon = require('sinon');
require("./commonTest.js");

var fileToTest = "../modules/devices.js";

describe(fileToTest, function(){
    var toTest = rewire(fileToTest); 
    toTest.__set__("logger", logger);

    
    it('Shall replace all devcies in cli-data file (getDevices)  >', function(done) {
	adminDataFile = {};

	var dataFile = {
	    username: username,
	    userToken: token,
	    accounts: [
		{
		    name: account.name,
		    id: account.id,
		    devices: [
			{
			    "deviceId": device.deviceId,
			    "name": device.name,
			    "components": [
				component
			    ]
			}
		    ]
		}
	    ]};
	
	var test = function(object, callback){
	    assert.equal(object.accountId, account.id);
	    callback(null, device);
	    assert.deepEqual(adminDataFile, dataFile);
	    done();
	}
	
	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.devices.getDevices = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("getDevices")(account.id);
    });


    it('Shall return response error (getDevices)  >', function(done) {
	adminDataFile = {};

	var test = function(object, callback){
	    object.token = token;
	    callback(new Error("Error"));
	}

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["responseError"].code);
	    done();
	}
	
	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.devices.getDevices = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("getDevices")(jsonString);
    });


    it('Shall fail to get accountId (getDevices)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["accountIdError"].code);
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsError);
	fakeApi.devices.getDevices = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("getDevices")(account.id);
    });


    it('Shall create and store a new devcies in cli-data file (createDevices)  >', function(done) {
	adminDataFile = {};

	var body = {
	    deviceId: deviceId2,
	    gatewayId: gatewayId,
	    name: deviceName2
	}
	var dataFile = {
	    userToken: token,
	    username: username,
	    accounts: [
		{
		    name: account.name,
		    id: account.id,
		    devices: [
			device2
		    ]
		}
	    ]};
	
	var test = function(object, callback){
	    assert.equal(object.accountId, account.id);
	    assert.deepEqual(object.body, body, "body does not match");
	    callback(null, device2);
	    assert.deepEqual(adminDataFile, dataFile);
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.devices.createDevice = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("createDevice")(account.id, gatewayId, deviceId2, deviceName2);
    });


    it('Shall create and store a new devcies in cli-data file (w/o name) (createDevices)  >', function(done) {
	adminDataFile = {};

	var body = {
	    deviceId: deviceId2,
	    gatewayId: gatewayId,
	    name: deviceId2 + "-NAME"
	}
	var dataFile = {
	    userToken: token,
	    username: username,
	    accounts: [
		{
		    name: account.name,
		    id: account.id,
		    devices: [
			device2
		    ]
		}
	    ]};
	
	var test = function(object, callback){

	    assert.equal(object.accountId, account.id);
	    assert.deepEqual(object.body, body, "body does not match");
	    callback(null, device2);
	    assert.deepEqual(adminDataFile, dataFile);
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.devices.createDevice = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("createDevice")(account.id, gatewayId, deviceId2);
    });


    it('Shall return response error (createDevice)  >', function(done) {
	adminDataFile = {};

	var test = function(object, callback){
	    object.token = token;
	    callback(new Error("Error"));
	}

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["responseError"].code);
	    done();
	}
	
	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.devices.createDevice = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("createDevice")(jsonString);
    });


    it('Shall fail to get accountId (createDevice)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["accountIdError"].code);
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsError);
	fakeApi.devices.createDevice = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("createDevice")(account.id);
    });


    it('Shall get device details and store in cli-data file (getDeviceDetails)  >', function(done) {
	adminDataFile = {};

	var dataFile = {
	    userToken: token,
	    username: username,
	    accounts: [
		{
		    name: "AccountName",
		    id: "321ef007-8449-477f-9ea0-d702d77e64b9",
		    devices: [
			device2
		    ]
		}
	    ]};
	
	var test = function(object, callback){
	    object.token = token;
	    assert.equal(object.accountId, account.id);
	    assert.equal(object.deviceId, deviceId);
	    callback(null, device2);
	    assert.equal(object.userToken, token, "userToken is wrong");
	    assert.equal(object.username, username, "username is wrong");
	    assert.deepEqual(adminDataFile, dataFile, "stored data does not match");
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.devices.getDeviceDetails = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("getDeviceDetails")(account.id, deviceId);
    });


    it('Shall return response error (getDeviceDetails)  >', function(done) {
	adminDataFile = {};

	var test = function(object, callback){
	    object.token = token;
	    callback(new Error("Error"));
	}

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["responseError"].code);
	    done();
	}
	
	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.devices.getDeviceDetails = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("getDeviceDetails")(jsonString);
    });


    it('Shall fail to get accountId (getDeviceDetails)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["accountIdError"].code);
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsError);
	fakeApi.devices.getDeviceDetails = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("getDeviceDetails")(account.id);
    });


    it('Shall fail to get deviceId (getDeviceDetails)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["deviceIdError"].code);
	    done();
	}

	var fakeLibToolsErrorDevice = Object.assign({}, fakeLibTools);
	fakeLibToolsErrorDevice.findDeviceId = fakeLibToolsError.findDeviceId;
	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsErrorDevice);
	fakeApi.devices.getDeviceDetails = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("getDeviceDetails")(account.id);
    });


    it('Shall update device details and store in cli-data file (updateDevice)  >', function(done) {
	adminDataFile = {};

	var dataFile = {
	    userToken: token,
	    username: username,
	    accounts: [
		{
		    name: "AccountName",
		    id: "321ef007-8449-477f-9ea0-d702d77e64b9",
		    devices: [
			device2
		    ]
		}
	    ]};
	
	var test = function(object, callback){
	    assert.equal(object.accountId, account.id);
	    assert.equal(object.deviceId, deviceId);
	    callback(null, device2);
	    assert.deepEqual(adminDataFile, dataFile, "stored data does not match");
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.devices.updateDevice = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("updateDevice")(account.id, deviceId, jsonString);
    });


    it('Shall fail to get accountId (updateDevice)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["accountIdError"].code);
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsError);
	fakeApi.devices.updateDevice = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("updateDevice")(account.id, deviceId, jsonString);
    });


    it('Shall fail to get deviceId (updateDevice)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["deviceIdError"].code);
	    done();
	}

	var fakeLibToolsErrorDevice = Object.assign({}, fakeLibTools);
	fakeLibToolsErrorDevice.findDeviceId = fakeLibToolsError.findDeviceId;
	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsErrorDevice);
	fakeApi.devices.updateDevice = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("updateDevice")(account.id, deviceId, jsonString);
    });


    it('Shall return  parseJson error (updateDevice)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["parseJsonError"].code);
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.devices.updateDevice = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("updateDevice")(account.id, deviceId, jsonStringError);
    });


    it('Shall return response error (updateDevice)  >', function(done) {
	adminDataFile = {};

	var test = function(object, callback){
	    object.token = token;
	    callback(new Error("Error"));
	}

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["responseError"].code);
	    done();
	}
	
	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.devices.updateDevice = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("updateDevice")(account.id, deviceId, jsonString);
    });
    
 
    it('Shall delete device details and remove from cli-data file (deleteDevice)  >', function(done) {
	adminDataFile = {};

	var dataFile = {
	    userToken: token,
	    username: username,
	    accounts: [
		{
		    name: "AccountName",
		    id: "321ef007-8449-477f-9ea0-d702d77e64b9",
		    devices: [
		    ]
		}
	    ]};
	
	var test = function(object, callback){
	    assert.equal(object.accountId, account.id);
	    assert.equal(object.deviceId, deviceId);
	    callback(null, device);
	    assert.deepEqual(adminDataFile, dataFile, "stored data does not match");
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.devices.deleteDevice = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("deleteDevice")(account.id, deviceId);
    });


    it('Shall fail to get accountId (deleteDevice)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["accountIdError"].code);
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsError);
	fakeApi.devices.deleteDevice = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("deleteDevice")(account.id, deviceId, jsonString);
    });


    it('Shall fail to get deviceId (deleteDevice)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["deviceIdError"].code);
	    done();
	}

	var fakeLibToolsErrorDevice = Object.assign({}, fakeLibTools);
	fakeLibToolsErrorDevice.findDeviceId = fakeLibToolsError.findDeviceId;
	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsErrorDevice);
	fakeApi.devices.deleteDevice = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("deleteDevice")(account.id, deviceId, jsonString);
    });

    
    it('Shall return response error (deleteDevice)  >', function(done) {
	adminDataFile = {};

	var test = function(object, callback){
	    object.token = token;
	    callback(new Error("Error"));
	}

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["responseError"].code);
	    done();
	}
	
	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.devices.deleteDevice = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("deleteDevice")(account.id, deviceId, jsonString);
    });

    
    it('Shall activate device and pass activation code (activateDevice)  >', function(done) {

	var body = {
	    activationCode: "jq4h6d2b"
	}
	
	var test = function(object, callback){
	    object.token = token;
	    assert.equal(object.accountId, account.id);
	    assert.equal(object.deviceId, deviceId);
	    assert.deepEqual(object.body, body, "body does not match");
	    callback(null, device);
	    assert.equal(object.userToken, token, "userToken is wrong");
	    assert.equal(object.username, username, "username is wrong");
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.devices.activateDevice = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("activateDevice")(account.id, deviceId, "jq4h6d2b");
    });


     it('Shall fail to get accountId (activateDevice)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["accountIdError"].code);
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsError);
	fakeApi.devices.activateDevice = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("activateDevice")(account.id, deviceId, "jq4h6d2b");
    });


    it('Shall fail to get deviceId (activateDevice)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["deviceIdError"].code);
	    done();
	}

	var fakeLibToolsErrorDevice = Object.assign({}, fakeLibTools);
	fakeLibToolsErrorDevice.findDeviceId = fakeLibToolsError.findDeviceId;
	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsErrorDevice);
	fakeApi.devices.acctivateDevice = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("activateDevice")(account.id, deviceId, "jq4h6d2b");
    });

    
    it('Shall return response error (activateDevice)  >', function(done) {
	adminDataFile = {};

	var test = function(object, callback){
	    object.token = token;
	    callback(new Error("Error"));
	}

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["responseError"].code);
	    done();
	}
	
	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.devices.activateDevice = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("activateDevice")(account.id, deviceId, "jq4h6d2b");
    });


    it('Shall add device component and put in cli-data file (addDeviceComponent)  >', function(done) {
	adminDataFile = {};

	var dataFile = {
	    userToken: token,
	    username: username,
	    accounts: [
		{
		    name: account.name,
		    id: account.id,
		    devices: [
			{
			    deviceId: deviceId,
			    name: deviceName,
			    components: [
				{
				    "cid": cid,
				    "name": component.name,
				    "type": component.type
				}
			    ]
			}
		    ]
		}
	    ]};
	 
	 var body = {
	     "cid": "436e7e74-6771-4898-9057-26932f5eb7e1",
	     "name": component.name,
	     "type": component.type
	}
	
	var test = function(object, callback){
	    assert.equal(object.accountId, account.id);
	    assert.equal(object.deviceId, deviceId);
	    assert.deepEqual(object.body, body, "body does not match");
	    callback(null, component);
	    assert.deepEqual(adminDataFile, dataFile, "stored data does not match");
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	toTest.__set__("uuid", fakeUuid); 
	fakeApi.devices.addDeviceComponent = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("addDeviceComponent")(account.id, deviceId, "temp", "temperature.v1.0");
     });


    it('Shall fail to get accountId (addDeviceComponent)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["accountIdError"].code);
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsError);
	fakeApi.devices.addDeviceComponent = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("addDeviceComponent")(account.id, deviceId, "jq4h6d2b");
    });


    it('Shall fail to get deviceId (addDeviceComponent)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["deviceIdError"].code);
	    done();
	}

	var fakeLibToolsErrorDevice = Object.assign({}, fakeLibTools);
	fakeLibToolsErrorDevice.findDeviceId = fakeLibToolsError.findDeviceId;
	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsErrorDevice);
	fakeApi.devices.addDeviceComponent = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("addDeviceComponent")(account.id, deviceId, "jq4h6d2b");
    });

    
    it('Shall return response error (addDeviceComponent)  >', function(done) {
	adminDataFile = {};

	var test = function(object, callback){
	    object.token = token;
	    callback(new Error("Error"));
	}

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["responseError"].code);
	    done();
	}
	
	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.devices.addDeviceComponent = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("addDeviceComponent")(account.id, deviceId, "jq4h6d2b");
    });


    it('Shall delete device component and remove in cli-data file (deleteDeviceComponent)  >', function(done) {
	adminDataFile = {};

	var dataFile = {
	    userToken: token,
	    username: username,
	    accounts: [
		{
		    name: account.name,
		    id: account.id,
		    devices: [
			{
			    deviceId: deviceId,
			    name: device.name,
			    components: [
			    ]
			}
		    ]
		}
	    ]};
	 
	var test = function(object, callback){
	    assert.equal(object.accountId, account.id);
	    assert.equal(object.deviceId, deviceId);
	    assert.equal(object.cid, cid);
	    callback(null, component);
	    assert.deepEqual(adminDataFile, dataFile, "stored data does not match");
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.devices.deleteDeviceComponent = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("deleteDeviceComponent")(account.id, deviceId, cid);
    });
    

    it('Shall fail to get accountId (deleteDeviceComponent)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["accountIdError"].code);
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsError);
	fakeApi.devices.deleteDeviceComponent = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("deleteDeviceComponent")(account.id, deviceId, cid);
    });


    it('Shall fail to get deviceId (deleteDeviceComponent)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["deviceIdError"].code);
	    done();
	}

	var fakeLibToolsErrorDevice = Object.assign({}, fakeLibTools);
	fakeLibToolsErrorDevice.findDeviceId = fakeLibToolsError.findDeviceId;
	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsErrorDevice);
	fakeApi.devices.deleteDeviceComponent = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("deleteDeviceComponent")(account.id, deviceId, cid);
    });

    
    it('Shall return response error (deleteDeviceComponent)  >', function(done) {
	adminDataFile = {};

	var test = function(object, callback){
	    object.token = token;
	    callback(new Error("Error"));
	}

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["responseError"].code);
	    done();
	}
	
	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.devices.deleteDeviceComponent = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("deleteDeviceComponent")(account.id, deviceId, cid);
    });


    it('Shall fail to get cid (deleteDeviceComponent)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["cidError"].code);
	    done();
	}

	var fakeLibToolsErrorDevice = Object.assign({}, fakeLibTools);
	fakeLibToolsErrorDevice.findCid = fakeLibToolsError.findCid;
	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsErrorDevice);
	fakeApi.devices.deleteDeviceComponent = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("deleteDeviceComponent")(account.id, deviceId, cid);
    });
    
    
    it('Shall add command for devices.js   >', function(done) {
	var program = {};
	var errorHandler = function(){return 1;};
	var command = sinon.spy();
	program.command = function(x){command();return this;}
	var description = sinon.spy();
	program.description = function(x){description(); return this;}
	var action = sinon.spy();
	program.action = function(x){action(); return this;}
	toTest.addCommand(program, errorHandler);
	assert.equal(command.callCount, 8);
	assert.equal(description.callCount, 8);
	assert.equal(action.callCount, 8);
	assert.deepEqual(toTest.__get__("errorHandler"), errorHandler,"wrong error handler");
	done();
    });
});
