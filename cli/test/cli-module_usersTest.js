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
    rewire = require('rewire');
var url = require('url');

var GlobalConfig = require('../config');

var fileToTest = "../cli-modules/users.js";

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

    var admin_data_file = {};
    var token = "Thisis myToken";
    var username = "test@example.com";
    var email = "test2@example.com";
    var userId = "20000";
    var password = "password";
    var new_password ="new password";
    toTest.__set__("logger", logger);
    fakeUserAdminData = {
	initializeUserAdminBaseData: function(username, token){
	},
	saveUserAdminBaseData: function(username, token){
	    admin_data_file.username = username;
	    admin_data_file.userToken = token;
	},
	loadUserAdminBaseData: function(){
	    return {
		username: username,
		userToken: token
	    }
	},
	saveUserAdminData: function(key, value){
	    admin_data_file[key] = value;
	}
	
    }
    
    
    fakeApi = {
	users: {
	    getUserInfo: {},
	}
    }
    
    it('Shall provide data for getUserInfo  >', function(done) {
	admin_data_file = {};

	data_file = {
	    userToken: token,
	    username: username
	}

	var test = function(object, callback){
	    object.token = token;
	    callback(null, object);
	    assert.equal(object.userToken, token, "userToken is wrong");
	    assert.equal(object.username, username, "username is wrong");
	    done();
	}
	toTest.__set__("userAdminData", fakeUserAdminData);
	fakeApi.users.getUserInfo = test;
	toTest.__set__("api", fakeApi)
        toTest.__get__("getUserInfo")(username, password);

    });
    it('Shall provide data for updateUserInfo  >', function(done) {
	admin_data_file = {};
	var body = {
	    "attributes": {
		"phone": 1234
	    }
	}
	
	var test = function(object, callback){
	    object.userToken = token;
	    callback(null, object);
	    assert.equal(object.userToken, token, "Wrong userToken");
	    assert.equal(object.username, username, "Wrong username");
	    assert.deepEqual(object.body, body, "Wrong body");
	    done();
	}
	toTest.__set__("userAdminData", fakeUserAdminData);
	fakeApi.users.updateUserInfo = test;
	toTest.__set__("api", fakeApi)
        toTest.__get__("updateUserInfo")(JSON.stringify(body));

    });
    it('Shall provide data for deleteUser  >', function(done) {
	admin_data_file = {};

	data_file = {
	    userId: userId
	}
	var test = function(object, callback){
	    callback(null, object);
	    assert.equal(object.deleteUserId, userId, "Wrong userId");
	    assert.equal(object.userToken, token, "Wrong userToken");
	    assert.equal(object.username, username, "Wrong username");
	    done();
	}
	toTest.__set__("userAdminData", fakeUserAdminData);
	fakeApi.users.deleteUser = test;
	toTest.__set__("api", fakeApi)
        toTest.__get__("deleteUser")(userId);
    });
    it('Shall provide data for requestUserPasswordChange  >', function(done) {
	admin_data_file = {};

	var body = {
	    email: email
	};
	data_file = {
	    userId: userId
	};
	
	var test = function(object, callback){
	    callback(null, object);
	    assert.deepEqual(object.body, body, "Wrong userId");
	    assert.equal(object.userToken, null, "Wrong userToken");
	    assert.equal(object.username, username, "Wrong username");
	    done();
	};
	toTest.__set__("userAdminData", fakeUserAdminData);
	fakeApi.users.requestUserPasswordChange = test;
	toTest.__set__("api", fakeApi)
        toTest.__get__("requestUserPasswordChange")(email);
    });
    it('Shall provide data for updateUserPassword  >', function(done) {
	admin_data_file = {};

	var body = {
	    token: token,
	    password: password
	};
	data_file = {
	    userId: userId
	};
	
	var test = function(object, callback){
	    callback(null, object);
	    assert.deepEqual(object.body, body, "Wrong userId");
	    assert.equal(object.userToken, null, "Wrong userToken");
	    assert.equal(object.username, username, "Wrong username");
	    done();
	};
	toTest.__set__("userAdminData", fakeUserAdminData);
	fakeApi.users.updateUserPassword = test;
	toTest.__set__("api", fakeApi)
        toTest.__get__("updateUserPassword")(token, password);
    });
    it('Shall provide data for changeUserPassword  >', function(done) {
	admin_data_file = {};

	var body = {
	    currentpwd: password,
	    password: new_password
	};
	data_file = {
	    userId: userId
	};
	
	var test = function(object, callback){
	    callback(null, object);
	    assert.deepEqual(object.body, body, "Wrong userId");
	    assert.equal(object.userToken, token, "Wrong userToken");
	    assert.equal(object.username, username, "Wrong username");
	    done();
	};
	toTest.__set__("userAdminData", fakeUserAdminData);
	fakeApi.users.changeUserPassword = test;
	toTest.__set__("api", fakeApi)
        toTest.__get__("changeUserPassword")(password, new_password);
    });
    it('Shall provide data for requestUserActivation  >', function(done) {
	admin_data_file = {};

	var body = {
	    email: email
	};
	
	var test = function(object, callback){
	    callback(null, object);
	    assert.deepEqual(object.body, body, "Wrong userId");
	    assert.equal(object.userToken, null, "Wrong userToken");
	    assert.equal(object.username, username, "Wrong username");
	    done();
	};
	toTest.__set__("userAdminData", fakeUserAdminData);
	fakeApi.users.requestUserActivation = test;
	toTest.__set__("api", fakeApi);
        toTest.__get__("requestUserActivation")(email);
    });
    it('Shall provide data for addUser  >', function(done) {
	admin_data_file = {};

	var body = {
	    email: email,
	    password: password
	};
	
	var test = function(object, callback){
	    callback(null, object);
	    assert.deepEqual(object.body, body, "Wrong userId");
	    assert.equal(object.userToken, token, "Wrong userToken");
	    assert.equal(object.username, username, "Wrong username");
	    done();
	};
	toTest.__set__("userAdminData", fakeUserAdminData);
	fakeApi.users.addUser = test;
	toTest.__set__("api", fakeApi);
        toTest.__get__("addUser")(email, password);
    });
    it('Shall provide data for activateUser  >', function(done) {
	admin_data_file = {};

	var body = {
	    token: token
	};
	
	var test = function(object, callback){
	    callback(null, object);
	    assert.deepEqual(object.body, body, "Wrong userId");
	    assert.equal(object.userToken, null, "Wrong userToken");
	    assert.equal(object.username, username, "Wrong username");
	    done();
	};
	toTest.__set__("userAdminData", fakeUserAdminData);
	fakeApi.users.activateUser = test;
	toTest.__set__("api", fakeApi);
        toTest.__get__("activateUser")(token);
    });
});
