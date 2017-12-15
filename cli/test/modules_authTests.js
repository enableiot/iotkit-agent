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
    sinon = require('sinon'),
    rewire = require('rewire');

require("./commonTest.js");

var fileToTest = "../modules/auth.js";

describe(fileToTest, function() {
    var toTest = rewire(fileToTest);
    toTest.__set__("logger", logger);
    
    
    it('Shall provide data for getAuthToken  >', function(done) {
        adminDataFile = {};

        data_file = {
            userToken: token,
            username: username
        }
        body = {
            username: username,
            password: password
        }
        var test = function(object, callback) {
            object.token = token;
            assert.deepEqual(object.body, body, "Body is wrong");
            callback(null, object);
            assert.deepEqual(data_file, adminDataFile, "Unexpected adminDataFile");
            done();
        }
        toTest.__set__("userAdminData", fakeUserAdminData);
        fakeApi.auth.getAuthToken = test;
        toTest.__set__("api", fakeApi)
        toTest.__set__("common", fakeCommon);
        toTest.__get__("getAuthToken")(username, password);

    });


    it('Shall return response error (getAuthToken)  >', function(done) {
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
        fakeApi.auth.getAuthToken = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__("errorHandler", fakeErrorHandler);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("getAuthToken")(username, password);
    });

    
    it('Shall provide data for getAuthTokenInfo  >', function(done) {
        adminDataFile = {};
        var sub = userId;
        dataFile = {
            userToken: token,
            username: username,
            accounts: account,
            userId: sub
        }
        var test = function(object, callback) {
            object.payload = {
                accounts: account,
                sub: sub        
            }
            callback(null, object);
            assert.deepEqual(dataFile, adminDataFile, "Unexpected adminDataFile");
            done();
        }
        toTest.__set__("userAdminData", fakeUserAdminData);
        fakeApi.auth.getAuthTokenInfo = test;
        toTest.__set__("api", fakeApi)
        toTest.__get__("getAuthTokenInfo")();
    });


    it('Shall provide data for getAuthTokenInfo with empty accounts>', function(done) {
        adminDataFile = {};
        var sub = userId;
        dataFile = {
            userToken: token,
            username: username,
            accounts: [],
            userId: sub
        }
        var test = function(object, callback) {
            object.payload = {
                accounts: {},
                sub: sub        
            }
            callback(null, object);
            assert.deepEqual(dataFile, adminDataFile, "Unexpected adminDataFile");
            done();
        }
        toTest.__set__("userAdminData", fakeUserAdminData);
        fakeApi.auth.getAuthTokenInfo = test;
        toTest.__set__("api", fakeApi)
        toTest.__get__("getAuthTokenInfo")();
    });


    it('Shall return response error (getAuthTokenInfo)  >', function(done) {
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
        fakeApi.auth.getAuthTokenInfo = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__("errorHandler", fakeErrorHandler);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("getAuthTokenInfo")(username, password);
    });
    
    
    it('Shall provide data for getAuthUserInfo  >', function(done) {
        adminDataFile = {};

        dataFile = {
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
            ],
            userId: userId
        }
        var test = function(object, callback) {
            object.id = userId;
            callback(null, object);
            assert.deepEqual(dataFile, adminDataFile, "Unexpected adminDataFile");
            done();
        }
        toTest.__set__("userAdminData", fakeUserAdminData);
        fakeApi.auth.getAuthUserInfo = test;
        toTest.__set__("api", fakeApi)
        toTest.__get__("getAuthUserInfo")();
    });


    it('Shall return response error (getAuthUserInfo)  >', function(done) {
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
        fakeApi.auth.getAuthUserInfo = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__("errorHandler", fakeErrorHandler);
        toTest.__set__("common", fakeCommon);
        toTest.__get__("getAuthUserInfo")(username, password);
    });
    

    it('Shall add command for auth.js   >', function(done) {
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
        assert.equal(command.callCount, 3);
        assert.equal(description.callCount, 3);
        assert.equal(action.callCount, 3);
        assert.deepEqual(toTest.__get__("errorHandler"), errorHandler,"wrong error handler");
        done();
    });
});
