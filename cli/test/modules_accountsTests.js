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

var fileToTest = "../modules/accounts.js";

describe(fileToTest, function(){
    var toTest = rewire(fileToTest);
    var logger  = {
        info : function(){},
        error : function() {},
        debug : function() {}
    };
    console.debug = function() {
        console.log(arguments);
    };

    var adminDataFile = {};
    var token = "Thisis myToken";
    var username = "test@example.com";
    var userId = "20000";
    var	jsonString='{"name": "MyAccount"}';
    var	jsonStringError='{"name": "MyAccount"';
    var account = {
	name: "AccountName",
	id: "321ef007-8449-477f-9ea0-d702d77e64b9"
    };
    var user = {
	"id": "321ef007-8449-477f-9ea0-d702d77e64b9",
	"email": "test@example.com"
    }
    toTest.__set__("logger", logger);
    
    var fakeUserAdminData = {
	initializeUserAdminBaseData: function(username, token){
	},
	saveUserAdminBaseData: function(username, token){
	    adminDataFile.username = username;
	    adminDataFile.userToken = token;
	},
	loadUserAdminBaseData: function(){
	    return {
		username: username,
		userToken: token
	    }
	},
	saveUserAdminData: function(key, value){
	    adminDataFile[key] = value;
	},
	addAccount: function(account){
	    adminDataFile["accounts"] = [];
	    adminDataFile["accounts"].push(account);
	},
	updateAccount: function(account){
	    this.addAccount(account);
	},
	deleteAccount: function(account){
	    adminDataFile["accounts"] = [];
	}
    }
    
    var fakeApi = {
	accounts: {
	    createAccount: {}
	}
    }

    var fakeLibTools = {
	findAccountId: function(accountId, accounts){
	    return {id: accountId, index: 0};
	}
    }

    var fakeLibToolsError = {
	findAccountId: function(accountId, accounts){
	    return null;
	}
    }

    var fakeCommon = {
	errors: {
	    "ok": {"code": 0, "message": "OK"},
	    "responseError":  {"code": 1, "message": "Server Response Error"},
	    "accountIdError": {"code": 2, "message": "Account ID not found in local file"},
	    "parseJsonError": {"code": 3, "message": "Can't parse JSON"}
	}
    }

    
    it('Shall add account data to cli-data file (createAccount)  >', function(done) {
	adminDataFile = {};
	var account = {
	    name: "AccountName",
	    id: "321ef007-8449-477f-9ea0-d702d77e64b9"
	};
	var dataFile = { accounts: [
	    account
	]};

	var test = function(object, callback){
	    object.token = token;
	    callback(null, account);
	    assert.equal(object.userToken, token, "userToken is wrong");
	    assert.equal(object.username, username, "username is wrong");
	    assert.deepEqual(adminDataFile, dataFile);
	    assert.deepEqual(object.body, JSON.parse(jsonString), "body not matching jsonString");
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.accounts.createAccount = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("createAccount")(jsonString);
    });


    it('Shall return response error (createAccount)  >', function(done) {
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
	fakeApi.accounts.createAccount = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("createAccount")(jsonString);
    });

    
    it('Shall return  parseJson error (createAccount)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["parseJsonError"].code);
	    done();
	}
	
	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.accounts.createAccount = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("createAccount")(jsonStringError);
    });


        it('Shall get account info and update cli-data file (getAccountInfo)  >', function(done) {
	adminDataFile = {};

	var dataFile = { accounts: [
	    account
	]};

	var test = function(object, callback){
	    object.token = token;
	    assert.equal(object.accountId, account.id);
	    callback(null, account);
	    assert.equal(object.userToken, token, "userToken is wrong");
	    assert.equal(object.username, username, "username is wrong");
	    assert.deepEqual(adminDataFile, dataFile); 
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.accounts.getAccountInfo = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("getAccountInfo")(account.id);
    });


    it('Shall return response error (getAccountInfo)  >', function(done) {
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
	fakeApi.accounts.getAccountInfo = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("getAccountInfo")(account.id);
    });

    
    it('Shall fail to get accountId (getAccountInfo)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["accountIdError"].code);
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsError);
	fakeApi.accounts.getAccountInfo = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("getAccountInfo")(account.id);
    });


    it('Shall update account data in cli-data file (updateAccount)  >', function(done) {
	adminDataFile = {};

	var dataFile = { accounts: [
	    account
	]};

	var test = function(object, callback){
	    object.token = token;
	    assert.equal(object.accountId, account.id);
	    callback(null, account);
	    assert.equal(object.userToken, token, "userToken is wrong");
	    assert.equal(object.username, username, "username is wrong");
	    assert.deepEqual(adminDataFile, dataFile);
	    assert.deepEqual(object.body, JSON.parse(jsonString), "body not matching jsonString");
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.accounts.updateAccount = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("updateAccount")(account.id, jsonString);
    });


    it('Shall return response error (updateAccount)  >', function(done) {
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
	fakeApi.accounts.updateAccount = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("updateAccount")(account.id, jsonString);
    });

    
    it('Shall fail to get accountId (updateAccount)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["accountIdError"].code);
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsError);
	fakeApi.accounts.updateAccount = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("updateAccount")(account.id, jsonString);
    });


    it('Shall return  parseJson error (updateAccount)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["parseJsonError"].code);
	    done();
	}
	
	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.accounts.updateAccount = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("updateAccount")(account.id, jsonStringError);
    });


    it('Shall delete account in cli-data file (deleteAccount)  >', function(done) {
	adminDataFile = {};

	var dataFile = {
	    accounts: []
	};

	var test = function(object, callback){
	    object.token = token;
	    assert.equal(object.accountId, account.id);
	    callback(null, account);
	    assert.equal(object.userToken, token, "userToken is wrong");
	    assert.equal(object.username, username, "username is wrong");
	    assert.deepEqual(adminDataFile, dataFile); 
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.accounts.deleteAccount = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("deleteAccount")(account.id);
    });


    it('Shall return response error (deleteAccount)  >', function(done) {
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
	fakeApi.accounts.deleteAccount = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("deleteAccount")(account.id);
    });

    
    it('Shall fail to get accountId (deleteAccount)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["accountIdError"].code);
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsError);
	fakeApi.accounts.deleteAccount = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("deleteAccount")(account.id);
    });


    it('Shall get account activation code (getAccountActivationCode)  >', function(done) {

	var test = function(object, callback){
	    object.token = token;
	    assert.equal(object.accountId, account.id);
	    callback(null, account);
	    assert.equal(object.userToken, token, "userToken is wrong");
	    assert.equal(object.username, username, "username is wrong");
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.accounts.getAccountActivationCode = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("getAccountActivationCode")(account.id);
    });


    it('Shall return response error (getAccountActivationCode)  >', function(done) {
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
	fakeApi.accounts.getAccountActivationCode = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("getAccountActivationCode")(account.id);
    });

    
    it('Shall fail to get accountId (getAccountActivationCode)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["accountIdError"].code);
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsError);
	fakeApi.accounts.getAccountActivationCode = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("getAccountActivationCode")(account.id);
    });


    it('Shall refresh activation code (refreshAccountActivationCode)  >', function(done) {

	var test = function(object, callback){
	    object.token = token;
	    assert.equal(object.accountId, account.id);
	    callback(null, account);
	    assert.equal(object.userToken, token, "userToken is wrong");
	    assert.equal(object.username, username, "username is wrong");
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.accounts.refreshAccountActivationCode = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("refreshAccountActivationCode")(account.id);
    });


    it('Shall return response error (refreshAccountActivationCode)  >', function(done) {
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
	fakeApi.accounts.refreshAccountActivationCode = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("refreshAccountActivationCode")(account.id);
    });

    
    it('Shall fail to get accountId (refreshAccountActivationCode)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["accountIdError"].code);
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsError);
	fakeApi.accounts.refreshAccountActivationCode = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("refreshAccountActivationCode")(account.id);
    });


    it('Shall change account user w/o jsonString (changeAccountUser)  >', function(done) {

	var body = {
	    "id": userId,
	    "accounts": {
	    }
	}
	body["accounts"][account.id] = "user";

	var test = function(object, callback){
	    object.token = token;
	    assert.equal(object.accountId, account.id);
	    callback(null, account);
	    assert.equal(object.userToken, token, "userToken is wrong");
	    assert.equal(object.username, username, "username is wrong");
	    assert.deepEqual(object.body, body, "body not matching");
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.accounts.changeAccountUser = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("common", fakeCommon);
         toTest.__get__("changeAccountUser")(account.id, userId);
    });

    
    it('Shall change account user w jsonString (changeAccountUser)  >', function(done) {

	var test = function(object, callback){
	    object.token = token;
	    assert.equal(object.accountId, account.id);
	    callback(null, account);
	    assert.equal(object.userToken, token, "userToken is wrong");
	    assert.equal(object.username, username, "username is wrong");
	    assert.deepEqual(object.body, JSON.parse(jsonString), "body not matching");
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.accounts.changeAccountUser = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("changeAccountUser")(account.id, userId, jsonString);
    });


    it('Shall return response error (changeAccountUser)  >', function(done) {
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
	fakeApi.accounts.changeAccountUser = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("changeAccountUser")(account.id, userId);
    });

    
    it('Shall fail to get accountId (changeAccountUser)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["accountIdError"].code);
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsError);
	fakeApi.accounts.changeAccountUser = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("changeAccountUser")(account.id, userId);
    });


    it('Shall return  parseJson error (changeAccountUser)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["parseJsonError"].code);
	    done();
	}
	
	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.accounts.changeAccountUser = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("changeAccountUser")(account.id, userId, jsonStringError);
    });


    it('Shall get users of account (getAccountUsers)  >', function(done) {
	var test = function(object, callback){
	    object.token = token;
	    assert.equal(object.accountId, account.id);
	    callback(null, user);
	    assert.equal(object.userToken, token, "userToken is wrong");
	    assert.equal(object.username, username, "username is wrong");
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.accounts.getAccountUsers = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("getAccountUsers")(account.id);
    });


    it('Shall return response error (getAccountUsers)  >', function(done) {
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
	fakeApi.accounts.getAccountUsers = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("getAccountUsers")(account.id);
    });

    
    it('Shall fail to get accountId (getAccountUsers)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["accountIdError"].code);
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibToolsError);
	fakeApi.accounts.getAccountUsers = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("getAccountUsers")(account.id);
    });

    
    it('Shall add command for accounts.js   >', function(done) {

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
