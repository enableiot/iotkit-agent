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
var url = require('url');

var GlobalConfig = require('../config');

var fileToTest = "../cli-modules/auth.js";

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
    var password = "password";
    toTest.__set__("logger", logger);
    var fakeUserAdminData = {
	initializeUserAdminBaseData: function(username, token){
	    adminDataFile = {};
	},
	saveUserAdminBaseData: function(username, token){
	    adminDataFile.username = username;
	    adminDataFile.userToken = token;
	    console.log("Saved User Admin Base DAta");
	},
	loadUserAdminBaseData: function(){
	    return {
		username: username,
		userToken: token
	    }
	},
	saveUserAdminData: function(key, value){
	    adminDataFile[key] = value;
	}
	
    }
    
    var fakeApi = {
	auth: {
	    getAuthToken: {},
	    getAuthTokenInfo: {},
	    getAuthUserInfo: {}
	    
	}	
    }
    
    it('Shall provide data for getAuthUserToken  >', function(done) {
	adminDataFile = {};

	data_file = {
	    userToken: token,
	    username: username
	}
	body = {
	    username: username,
	    password: password
	}
	var test = function(object, callback){
	    object.token = token;
	    callback(null, object);
	    console.log("adminDataFile", adminDataFile);
	    assert.equal(object.token, adminDataFile.userToken, "Token is wrong");
	    assert.deepEqual(object.body, body, "Body is wrong");
	    assert.equal(object.body.password, password, "Password is wrong");
	    assert.deepEqual(data_file, adminDataFile, "Unexpected adminDataFile");
	    done();
	}
	toTest.__set__("userAdminData", fakeUserAdminData);
	fakeApi.auth.getAuthToken = test;
	toTest.__set__("api", fakeApi)
        toTest.__get__("getAuthUserToken")(username, password);

    });
    it('Shall provide data for getAuthUserTokenInfo  >', function(done) {
	adminDataFile = {};
	var sub = userId;
	var accounts = {
	    accountId: "account1",
	    role: "admin"
	};

	dataFile = {
	    accounts: accounts,
	    userId: sub
	}
	var test = function(object, callback){
	    object.payload = {
		accounts: accounts,
		sub: sub		
	    }
	    callback(null, object);
	    assert.equal(object.userToken, token, "Wrong userToken");
	    assert.equal(object.payload.accounts, accounts, "Account is wrong");
	    assert.equal(object.payload.sub, sub, "Retreived sub wrong");
	    assert.deepEqual(dataFile, adminDataFile, "Unexpected adminDataFile");
	    done();
	}
	toTest.__set__("userAdminData", fakeUserAdminData);
	fakeApi.auth.getAuthTokenInfo = test;
	toTest.__set__("api", fakeApi)
        toTest.__get__("getAuthUserTokenInfo")();

    });
    it('Shall provide data for getAuthUserInfo  >', function(done) {
	adminDataFile = {};

	dataFile = {
	    userId: userId
	}
	var test = function(object, callback){
	    object.id = userId;
	    callback(null, object);
	    assert.equal(object.userToken, token, "Wrong userToken");
	    assert.equal(object.id, userId, "Wrong userId");
	    assert.deepEqual(dataFile, adminDataFile, "Unexpected adminDataFile");
	    done();
	}
	toTest.__set__("userAdminData", fakeUserAdminData);
	fakeApi.auth.getAuthUserInfo = test;
	toTest.__set__("api", fakeApi)
        toTest.__get__("getAuthUserInfo")();
    });
});
