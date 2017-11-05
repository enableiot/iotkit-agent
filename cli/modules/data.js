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
    math = require("mathjs"),
    fs = require('fs'),
    logger = require("oisp-sdk-js").lib.logger.init(),
    userAdminTools = require("../lib/cli-tools"),
    common = require("../lib/common"),
    userAdminData = require("../lib/cli-data");
var errorHandler = {};

var submitData = function(accountId, deviceId, cid, value, jsonString){
    logger.info("Starting submitData ...");
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
    var on = (new Date()).getTime();
    userAdminDataObj.body = {
        "on": on,
        "accountId": targetAccount.id,
        "data": [
            {
                "componentId": targetCid.id,
                "on": on,
                "value": value
            }
        ]       
    };
    if (jsonString){
        try {
            userAdminDataObj.body.data[0].attributes = JSON.parse(jsonString).attributes;
        } catch (e) {
	    logger.error(common.errors["parseJsonError"].message + ": " + e);
	    errorHandler(null, common.errors["parseJsonError"].code);
        }
    }
    api.data.submitData(userAdminDataObj, function(err, response){
        if (!err && response){
            logger.info("Info retrieved: ", response);
        }
        else{
	    logger.error(common.errors["responseError"].message + ": " + err);
	    errorHandler(null, common.errors["responseError"].code);
        }
    });
    
};


var submitDataFromFile = function(accountId, deviceId, cid, filename, jsonString){
    logger.info("Starting submitDataFromFile ...");
    var value;
     try {
         value = fs.readFileSync(filename, {encoding: "utf8"});
    } catch (e) {
	logger.error(common.errors["fsError"].message + ": " + e);
	errorHandler(null, common.errors["fsError"].code);
    }
    submitData(accountId, deviceId, cid, value.trim(), jsonString);
};


var searchDataToFile = function(accountId, deviceId, cid, from, to, filename/*, jsonString*/){
    logger.info("Starting searchDataToFile ...");
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
    userAdminDataObj.body = {
        "metrics": [
            {
                "id": targetCid.id,
                "op": "none"
            }
        ],
        "targetFilter": {
            "deviceList": [
                targetDevice.id
            ]
        }
    };
    if (from !== ""){
        userAdminDataObj.body.from = math.eval(from);
    }
    if (to !== "") {
        userAdminDataObj.body.to = math.eval(to);
    }
    api.data.searchData(userAdminDataObj, function(err, response){
        if (!err && response){
            if (response.series && filename) {
                response.series.forEach(function(i){
                    if (i.points){
                        i.points.forEach(function(j){
                            fs.writeFileSync(filename + "." + j.ts, j.value, {encoding: "utf8"});
                            j.value = "file:" + filename + "." + j.ts;
                        });
                    }
                    
                });
            }
            logger.info("Info retrieved: ", response);
        }
        else{
	    logger.error(common.errors["responseError"].message + ": " + err);
	    errorHandler(null, common.errors["responseError"].code);
        }
    });
};


var searchData = function(accountId, deviceId, cid, from, to, jsonString){
    logger.info("Starting searchData ...");
    searchDataToFile(accountId, deviceId, cid, from, to, null,jsonString);
};


var searchDataAdvancedToFile = function(accountId, from, to, filename, jsonString){
    logger.info("Starting searchData ...");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts); 
    if (targetAccount === null) {
	logger.error(common.errors["accountIdError"].message);
	errorHandler(null, common.errors["accountIdError"].code);
    }
    userAdminDataObj.accountId = targetAccount.id;
    if (jsonString){
        try {
            userAdminDataObj.body = JSON.parse(jsonString);
        } catch (e) {
	    logger.error(common.errors["parseJsonError"].message + ": " + e);
	    errorHandler(null, common.errors["parseJsonError"].code);
        }
    }
    if (from !== ""){
        userAdminDataObj.body.from = math.eval(from);
    }
    if (to !== "") {
        userAdminDataObj.body.to = math.eval(to);
    }
    api.data.searchDataAdvanced(userAdminDataObj, function(err, response){
        if (!err && response){
            if (response.data) {
                response.data.forEach(function(i){
                    if (i.components){
                        i.components.forEach(function(j){
			    if (j.samples){
				j.samples.forEach(function(k){
				    fs.writeFileSync(filename + "." + k[0], k[1], {encoding: "utf8"});
				    k[1] = "file:" + filename + "." + k[0];
				});
			    }
                        });
                    }
                    
                });
            }   
            logger.info("Info retrieved: ", response);
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
            .command('data.post  <accountId> <deviceId> <cid> <value> [jsonString]')
            .description('|Submit data for device.|POST:/v1/api/data/admin/{deviceId}')
            .action(submitData);
        program
            .command('data.post.file  <accountId> <deviceId> <cid> <filename> [jsonString]')
            .description('|Submit data from file for device.|POST:/v1/api/data/admin/{deviceId}')
            .action(submitDataFromFile);
        program
            .command('data.post.search <accountId> <deviceId> <cid> <from> <to> [jsonString]')
            .description('|Retrieve data according to filter in <jsonString>.|POST:/v1/api/accounts/{accountId}/data/search')
            .action(searchData);
        program
            .command('data.post.search.toFile <accountId> <deviceId> <cid> <from> <to> <filename> [jsonString]')
            .description('|Retrieve data according to filter in <jsonString>.|POST:/v1/api/accounts/{accountId}/data/search')
            .action(searchDataToFile);
        program
            .command('data.post.advanced.toFile <accountId> <from> <to> <filename> <jsonString>')
            .description('|Retrieve data with advanced search.|POST:/v1/api/accounts/{accountId}/data/search/advanced')
            .action(searchDataAdvancedToFile);
    }
};
