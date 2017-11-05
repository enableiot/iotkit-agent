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
    sinon = require('sinon'),
    rewire = require('rewire');
require("./commonTest.js");

var fileToTest = "../modules/users.js";

describe(fileToTest, function(){
    var toTest = rewire(fileToTest);

    toTest.__set__("logger", logger);
    
    it('Shall provide data for getUserInfo  >', function(done) {
	adminDataFile = {};

	dataFile = {
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
        toTest.__get__("getUserInfo")();

    });


     it('Shall return response error (getUserInfo)  >', function(done) {
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
	fakeApi.users.getUserInfo = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
         toTest.__get__("getUserInfo")();
     });

    
    it('Shall provide data for updateUserInfo  >', function(done) {
	adminDataFile = {};
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


    it('Shall return response error (updateUserInfo)  >', function(done) {
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
	fakeApi.users.updateUserInfo = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("updateUserInfo")(jsonString);
     });


    it('Shall return  parseJson error (updateUserInfo)  >', function(done) {

	var fakeErrorHandler = function(error, code){
	    assert.equal(code, fakeCommon.errors["parseJsonError"].code);
	    done();
	}

	toTest.__set__("userAdminData", fakeUserAdminData);
	toTest.__set__("userAdminTools", fakeLibTools);
	fakeApi.users.updateUserInfo = function(){};
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
	toTest.__get__("updateUserInfo")(jsonStringError);
	});
    
    
    it('Shall provide data for deleteUser  >', function(done) {
	adminDataFile = {};

	dataFile = {
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


    it('Shall return response error (deleteUser)  >', function(done) {
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
	fakeApi.users.deleteUser = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("deleteUser")(userId);
    });
    
    
    it('Shall provide data for requestUserPasswordChange  >', function(done) {
	adminDataFile = {};

	var body = {
	    email: email
	};
	dataFile = {
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


    it('Shall return response error (requestUserPasswordChange)  >', function(done) {
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
	fakeApi.users.requestUserPasswordChange = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("requestUserPasswordChange")(email);
    });

    
    it('Shall provide data for updateUserPassword  >', function(done) {
	adminDataFile = {};

	var body = {
	    token: token,
	    password: password
	};
	dataFile = {
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

    it('Shall return response error (updateUserPassword)  >', function(done) {
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
	fakeApi.users.updateUserPassword = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("updateUserPassword")(token, password);
     });

    
    it('Shall provide data for changeUserPassword  >', function(done) {
	adminDataFile = {};

	var body = {
	    currentpwd: password,
	    password: new_password
	};
	dataFile = {
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


    it('Shall return response error (changeUserPassword)  >', function(done) {
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
	fakeApi.users.changeUserPassword = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("changeUserPassword")(password,new_password);
    });
    
    
    it('Shall provide data for requestUserActivation  >', function(done) {
	adminDataFile = {};

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

    
    it('Shall return response error (requestUserActivation)  >', function(done) {
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
	fakeApi.users.requestUserActivation = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("requestUserActivation")(email);
    });
    
    
    it('Shall provide data for addUser  >', function(done) {
	adminDataFile = {};

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


    it('Shall return response error (addUser)  >', function(done) {
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
	fakeApi.users.addUser = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("addUser")(email, password);
    });
    
    
    it('Shall provide data for activateUser  >', function(done) {
	adminDataFile = {};

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


    it('Shall return response error (activateUser)  >', function(done) {
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
	fakeApi.users.activateUser = test;
	toTest.__set__("api", fakeApi);
	toTest.__set__("errorHandler", fakeErrorHandler);
	toTest.__set__("common", fakeCommon);
        toTest.__get__("activateUser")(token);
     });
    
    
    it('Shall add command for users.js   >', function(done) {
	var program = {};
	var errorHandler = function(){return 1;};
	var command = sinon.spy();
	program.command = function(x){command();return this;}
	var description = sinon.spy();
	program.description = function(x){description(); return this;}
	var action = sinon.spy();
	program.action = function(x){action(); return this;}
	toTest.addCommand(program, errorHandler);
	assert.equal(command.callCount, 9);
	assert.equal(description.callCount, 9);
	assert.equal(action.callCount, 9);
	assert.deepEqual(toTest.__get__("errorHandler"), errorHandler,"wrong error handler");
	done();
    });
});
