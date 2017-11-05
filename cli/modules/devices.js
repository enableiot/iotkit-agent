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
"use strict";

var api = require("oisp-sdk-js").api.rest,
    logger = require("oisp-sdk-js").lib.logger.init(),
    userAdminTools = require("../lib/cli-tools"),
    uuid = require("node-uuid"),
    userAdminData = require("../lib/cli-data"),
    common = require("../lib/common");
var errorHandler = {};

var getDevices= function(accountId){
    logger.info("Starting getDevices ...");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (! targetAccount){
	logger.error(common.errors["accountIdError"].message);
	errorHandler(null, common.errors["accountIdError"].code);
    }
    userAdminDataObj.accountId = targetAccount.id;
    api.devices.getDevices(userAdminDataObj,function(err, response){
	if (!err && response){
	    logger.info("Info retrieved: ", response);
	    userAdminData.replaceAllDevices(targetAccount.index, response);
	}
	else{
	    logger.error(common.errors["responseError"].message + ": " + err);
	    errorHandler(null, common.errors["responseError"].code);
	}
    });
};

var createDevice = function(accountId, gatewayId, deviceId, name){
    logger.info("Starting createDevice ...");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (targetAccount === null) {
	logger.error(common.errors["accountIdError"].message);
	errorHandler(null, common.errors["accountIdError"].code);
    }
    userAdminDataObj.accountId = targetAccount.id;
    if (! name) {
	name = deviceId + "-NAME";
    }
    userAdminDataObj.body = {
	deviceId: deviceId,
	gatewayId: gatewayId,
	name: name
    };
    api.devices.createDevice(userAdminDataObj, function(err, response){
	if (!err && response){
	    logger.info("Info retrieved: ", response);
	    userAdminData.addDevice(targetAccount.index, response);
	}
	else{
	    logger.error(common.errors["responseError"].message + ": " + err);
	    errorHandler(null, common.errors["responseError"].code);
	}
    });
};

var getDeviceDetails = function(accountId, deviceId){
    logger.info("Starting getDeviceDetails ...");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (targetAccount === null) {
	logger.error(common.errors["accountIdError"].message);
	errorHandler(null, common.errors["accountIdError"].code);
    }
    userAdminDataObj.accountId = targetAccount.id;
    var targetDevice = userAdminTools.findDeviceId(deviceId, userAdminDataObj.accounts[targetAccount.index]);
    if (targetDevice === null) {
	logger.error(common.errors["deviceIdError"].message);
	errorHandler(null, common.errors["deviceIdError"].code);
    }
    userAdminDataObj.deviceId = targetDevice.id;
    api.devices.getDeviceDetails(userAdminDataObj, function(err, response){
	if (!err && response){
	    logger.info("Info retrieved: ", response);
	    userAdminData.replaceDevice(targetAccount.index, targetDevice.index, response);
	}
	else{
	    logger.error(common.errors["responseError"].message + ": " + err);
	    errorHandler(null, common.errors["responseError"].code);
	}
    });
};


var updateDevice = function(accountId, deviceId, jsonString){
    logger.info("Starting updateDevice ...");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (targetAccount === null) {
	logger.error(common.errors["accountIdError"].message);
	errorHandler(null, common.errors["accountIdError"].code);
    }
    userAdminDataObj.accountId = targetAccount.id;
    var targetDevice = userAdminTools.findDeviceId(deviceId, userAdminDataObj.accounts[targetAccount.index]);
    if (targetDevice === null) {
	logger.error(common.errors["deviceIdError"].message);
	errorHandler(null, common.errors["deviceIdError"].code);
    }
    userAdminDataObj.deviceId = targetDevice.id;
    try {
	userAdminDataObj.body = JSON.parse(jsonString);
    } catch (e) {
	logger.error(common.errors["parseJsonError"].message + ": " + e);
	errorHandler(null, common.errors["parseJsonError"].code);
    }
    api.devices.updateDevice(userAdminDataObj, function(err, response){
	if (!err && response){
	    logger.info("Info retrieved: ", response);
	    userAdminData.replaceDevice(targetAccount.index, targetDevice.index, response);
	}
	else{
	    logger.error(common.errors["responseError"].message + ": " + err);
	    errorHandler(null, common.errors["responseError"].code);
	}
    });
};



var deleteDevice = function(accountId, deviceId){
    logger.info("Starting deleteDevice ...");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (targetAccount === null) {
	logger.error(common.errors["accountIdError"].message);
	errorHandler(null, common.errors["accountIdError"].code);
    }
    userAdminDataObj.accountId = targetAccount.id;
    var targetDevice = userAdminTools.findDeviceId(deviceId, userAdminDataObj.accounts[targetAccount.index]);
    if (targetDevice === null) {
	logger.error(common.errors["deviceIdError"].message);
	errorHandler(null, common.errors["deviceIdError"].code);
    }
    userAdminDataObj.deviceId = targetDevice.id;
    api.devices.deleteDevice(userAdminDataObj, function(err, response){
	if (!err && response){
	    logger.info("Info retrieved: ", response);
	    userAdminData.removeDevice(targetAccount.index, targetDevice.index);
	}
	else{
	    logger.error(common.errors["responseError"].message + ": " + err);
	    errorHandler(null, common.errors["responseError"].code);
	}
    });
};


var activateDevice= function(accountId, deviceId, activationCode){
    logger.info("Starting activateDevice ...");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (targetAccount === null) {
	logger.error(common.errors["accountIdError"].message);
	errorHandler(null, common.errors["accountIdError"].code);
    }
    userAdminDataObj.accountId = targetAccount.id;
    var targetDevice = userAdminTools.findDeviceId(deviceId, userAdminDataObj.accounts[targetAccount.index]);
    if (targetDevice === null) { 
	logger.error(common.errors["deviceIdError"].message);
	errorHandler(null, common.errors["deviceIdError"].code);
    }
    userAdminDataObj.deviceId = targetDevice.id;
    userAdminDataObj.body = {
	activationCode: activationCode
    };
    api.devices.activateDevice(userAdminDataObj,function(err, response){
	if (!err && response){
	    logger.info("Info retrieved: ", response);
	}
	else{
	    logger.error(common.errors["responseError"].message + ": " + err);
	    errorHandler(null, common.errors["responseError"].code);
	}
    });
};


var addDeviceComponent = function(accountId, deviceId, name, type){
    logger.info("Starting addDeviceComponent ...");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (targetAccount === null) {
	logger.error(common.errors["accountIdError"].message);
	errorHandler(null, common.errors["accountIdError"].code);
    }
    userAdminDataObj.accountId = targetAccount.id;
    var targetDevice = userAdminTools.findDeviceId(deviceId, userAdminDataObj.accounts[targetAccount.index]);
    if (targetDevice === null) {
	logger.error(common.errors["deviceIdError"].message);
	errorHandler(null, common.errors["deviceIdError"].code);
    }
    userAdminDataObj.deviceId = targetDevice.id;
    userAdminDataObj.body = {
	cid: uuid.v4(),
	name: name,
	type: type
    };
    api.devices.addDeviceComponent(userAdminDataObj, function(err, response){
	
	if (!err && response){
	    logger.info("Info retrieved: ", response);
	    userAdminData.addComponent(targetAccount.index, targetDevice.index, response);
	}
	else{
	    logger.error(common.errors["responseError"].message + ": " + err);
	    errorHandler(null, common.errors["responseError"].code);
	}
    });
};


var deleteDeviceComponent = function(accountId, deviceId, cid){
    logger.info("Starting deleteDeviceComponent ...");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (targetAccount === null) {
	logger.error(common.errors["accountIdError"].message);
	errorHandler(null, common.errors["accountIdError"].code);
    }
    userAdminDataObj.accountId = targetAccount.id;
    var targetDevice = userAdminTools.findDeviceId(deviceId, userAdminDataObj.accounts[targetAccount.index]);
    if (targetDevice === null) {
	logger.error(common.errors["deviceIdError"].message);
	errorHandler(null, common.errors["deviceIdError"].code);
    }
    userAdminDataObj.deviceId = targetDevice.id;
    var targetCid = userAdminTools.findCid(cid, userAdminDataObj.accounts[targetAccount.index].devices[targetDevice.index]);
    if (targetCid === null) {
	logger.error(common.errors["cidError"].message);
	errorHandler(null, common.errors["cidError"].code);
    }
    userAdminDataObj.cid = targetCid.id;
    api.devices.deleteDeviceComponent(userAdminDataObj, function(err, response){
	if (!err && response){
	    logger.info("Info retrieved: ", response);
	    userAdminData.deleteComponent(targetAccount.index, targetDevice.index, targetCid.index);
	}
	else{
	    logger.error(common.errors["responseError"].message + ": " + err);
	    errorHandler(null, common.errors["responseError"].code);
	}
    });
};


module.exports = {
    addCommand : function (program, errorHdl) {
	errorHandler = errorHdl;
        program
            .command('devices.get <accountId>')
            .description('|List devices for account.|Get:/v1/api/accounts/{accountId}/devices')
            .action(getDevices);
        program
            .command('devices.post <accountId> <gatewayId> <deviceId> [name]')
            .description('|Create Device.|Post:/v1/api/accounts/{accountId}/devices')
            .action(createDevice);
        program
            .command('devices.get.deviceId <accountId> <deviceId>')
            .description('|Get details of one device.|GET:/v1/api/accounts/{accountId}/devices/{deviceId}')
            .action(getDeviceDetails);
	program
            .command('devices.put.deviceId <accountId> <deviceId> <jsonString>')
            .description('|Update device details.|PUT:/v1/api/accounts/{accountId}/devices/{deviceId}')
            .action(updateDevice);
	program
            .command('devices.delete.deviceId <accountId> <deviceId>')
            .description('|Delete a device.|GET:/v1/api/accounts/{accountId}/devices/{deviceId}')
            .action(deleteDevice);
	program
            .command('devices.put.activation <accountId> <deviceId> <activationCode>')
            .description('|Activate a device with activationCode|PUT:/v1/api/devices/{deviceId}/activation')
            .action(activateDevice);
	program
            .command('devices.put.components <accountId> <deviceId> <name> <type>')
            .description('|Add component to device|POST:/v1/api/accounts/{accountId}/devices/{deviceId}/components')
            .action(addDeviceComponent);
	program
	    .command('devices.delete.components <accountId> <deviceId> <cid>')
	    .description('|Delete a component.|DELETE:/v1/api/accounts/{accountId}/devices/{deviceId}/components/{cid}')
	    .action(deleteDeviceComponent);
	
    }
};
