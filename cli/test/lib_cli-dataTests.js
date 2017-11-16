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


var fileToTest = "../lib/cli-data.js";


var username = "username";
var token    = "token";
var file     = '{"object": "object"}';


var fakeFs = {
    writeFileSync: function(filename, data){
	return undefined;
    },
    existsSync: function(filepath){
	if (filepath === "exists" ||
	    filepath === "/file/admin.js")
	{
	    return true;
	}
	return false;
    },
    readFileSync: function(filename){
	return objectFile;
    }
}


var logger  = {
    log: function(){},
    info : function(){},
    error : function() {},
    debug : function() {}
};

var fakeCommon = {
    getFileFromDataDirectory: function(filename){
	return "/file/" + filename;
    },
    saveToConfig: function(filename, key, data){
	assert.equal(filename, "/file/admin.js", "Wrong filename");
    }
}


describe(fileToTest, function(){
    var toTest = rewire(fileToTest);
    toTest.__set__("logger", logger);


    it('Shall get config file name >', function(done) {

	var config = {
	    admin_file: "admin.js"
	};
	toTest.__set__("localConf", config);
	toTest.__set__("common", fakeCommon);
        assert.equal(toTest.getConfigFileName(), "/file/admin.js", "Wrong filename returned");
	done();
    });


    it('Shall not find config file and throw error >', function(done) {

	var config = {};
	toTest.__set__("localConf", config);
	toTest.__set__("common", fakeCommon);
        assert.throws(toTest.getConfigFileName, /No admin file found/, "Should throw error.");
	done();
    });


    it('Shall get config file name >', function(done) {

	var spy = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.saveToConfig = function(filename, key, value){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    if (key === "username") {
		assert.equal(value, username, "Wrong value");
	    }
	    else if (key === "userToken") {
		assert.equal(value, token, "Wrong value");
	    }
	    else {
		assert.equal(true, false, "Should not reach this point");
	    }
	}
	toTest.__set__("localConf", config);
	toTest.__set__("common", localFakeCommon);
        assert.equal(toTest.saveUserAdminBaseData(username, token), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledTwice, "SaveToConfig not called correctly");
	done();
    });


    it('Shall load admin data >', function(done) {

	var spy = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.readConfig = function(filename){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    return JSON.parse(file);
	}
	toTest.__set__("localConf", config);
	toTest.__set__("common", localFakeCommon);
        assert.deepEqual(toTest.loadUserAdminBaseData(username, username), JSON.parse(file), "Return value of function does not match");
	assert.isTrue(spy.calledOnce, "SaveToConfig not called correctly");
	done();
    });


    it('Shall fail to load admin data and throw error >', function(done) {

	var spy = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.readConfig = function(filename){
	    spy();
	    return null;
	}
	toTest.__set__("localConf", config);
	toTest.__set__("common", localFakeCommon);
	var wrapper = function(){
	    toTest.loadUserAdminBaseData(username, username);
	}
        assert.throws(wrapper, /Could not load user admin base data/, "Should throw and error.");
	assert.isTrue(spy.calledOnce, "readConfig not called correctly");
	done();
    });


    it('Shall initialize admin data >', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.initializeFile = function(filename, obj){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    assert.deepEqual(obj, {username: "username", userToken: "userToken"});
	}
	var localFakeFs = Object.assign({}, fakeFs);
	localFakeFs.unlinkSync = function(filename){
	    spy2();
	}
	toTest.__set__("localConf", config);
	toTest.__set__("common", localFakeCommon);
	toTest.__set__("fs", localFakeFs);
        assert.deepEqual(toTest.initializeUserAdminBaseData(), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledOnce, "Initialize not called correctly");
	assert.isTrue(spy2.called, "unlink should be called once");
	done();
    });


    it('Shall initialize admin data and unlink file >', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin2.js"
	};
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.initializeFile = function(filename, obj){
	    spy();
	    assert.equal(filename, "/file/admin2.js", "Wrong filename returned");
	    assert.deepEqual(obj, {username: "username", userToken: "userToken"});
	}
	var localFakeFs = Object.assign({}, fakeFs);
	localFakeFs.unlinkSync = function(filename){
	    spy2();
	}
	toTest.__set__("localConf", config);
	toTest.__set__("common", localFakeCommon);
	toTest.__set__("fs", localFakeFs);
        assert.deepEqual(toTest.initializeUserAdminBaseData(), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledOnce, "Initialize not called correctly");
	assert.isFalse(spy2.called, "unlink should not be called");
	done();
    });


    it('Shall add account >', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var admin_file = {
	    accounts: [
		{"name": "Account1"}
	    ]
	}
	var result_admin_file = {
	    accounts: [
		{"name": "Account1"},
		{"name": "Account2"}
	    ]
	}
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.readConfig = function(filename, obj){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    return admin_file;
	}
	localFakeCommon.writeConfig = function(filename, data){
	    spy2();
	    assert.deepEqual(data,result_admin_file, "Incorrect result");
	}
	toTest.__set__("localConf", config);
	toTest.__set__("common", localFakeCommon);
        assert.deepEqual(toTest.addAccount({name: "Account2"}), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledOnce, "readConfig not called correctly");
	assert.isTrue(spy2.calledOnce, "writeConfig not called correctly");
	done();
    });


    it('Shall add account in empty structure >', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var admin_file = {
	}
	var result_admin_file = {
	    accounts: [
		{"name": "Account2"}
	    ]
	}
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.readConfig = function(filename, obj){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    return admin_file;
	}
	localFakeCommon.writeConfig = function(filename, data){
	    spy2();
	    assert.deepEqual(data,result_admin_file, "Incorrect result");
	}
	toTest.__set__("localConf", config);
	toTest.__set__("common", localFakeCommon);
        assert.deepEqual(toTest.addAccount({name: "Account2"}), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledOnce, "readConfig not called correctly");
	assert.isTrue(spy2.calledOnce, "writeConfig not called correctly");
	done();
    });


    it('Shall update account >', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1"},
		{"name": "Account2", "id": "2"}
	    ]
	}
	var result_admin_file = {
	    accounts: [
		{"name": "Account3", "id": "1"},
		{"name": "Account2", "id": "2"}
	    ]
	}
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.readConfig = function(filename, obj){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    return admin_file;
	}
	localFakeCommon.writeConfig = function(filename, data){
	    spy2();
	    assert.deepEqual(data,result_admin_file, "Incorrect result");
	}
	toTest.__set__("localConf", config);
	toTest.__set__("common", localFakeCommon);
        assert.deepEqual(toTest.updateAccount({name: "Account3", "id": "1"}), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledOnce, "readConfig not called correctly");
	assert.isTrue(spy2.calledOnce, "writeConfig not called correctly");
	done();
    });


    it('Shall not update non-existing account or empty account list>', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var admin_file = {
	}
	var result_admin_file = {
	    accounts: []
	}
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.readConfig = function(filename, obj){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    return admin_file;
	}
	localFakeCommon.writeConfig = function(filename, data){
	    spy2();
	    assert.deepEqual(data,result_admin_file, "Incorrect result");
	}
	toTest.__set__("localConf", config);
	toTest.__set__("common", localFakeCommon);
        assert.equal(toTest.updateAccount({name: "Account2", "id": "2"}), undefined, "Return value of function does not match");
	admin_file = { accounts: [] }
	assert.equal(toTest.updateAccount({name: "Account2", "id": "2"}), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledTwice, "readConfig not called correctly");
	assert.isTrue(spy2.calledOnce, "writeConfig not called correctly");
	done();
    });


    it('Shall delete account >', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1"},
		{"name": "Account2", "id": "2"}
	    ]
	}
	var result_admin_file = {
	    accounts: [
		{"name": "Account2", "id": "2"}
	    ]
	}
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.readConfig = function(filename, obj){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    return admin_file;
	}
	localFakeCommon.writeConfig = function(filename, data){
	    spy2();
	    assert.deepEqual(data,result_admin_file, "Incorrect result");
	}
	toTest.__set__("localConf", config);
	toTest.__set__("common", localFakeCommon);
        assert.equal(toTest.deleteAccount("1"), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledOnce, "readConfig not called correctly");
	assert.isTrue(spy2.calledOnce, "writeConfig not called correctly");
	done();
    });


    it('Shall not delete non-existing account or empty account list>', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var admin_file = {
	}
	var result_admin_file = {
	    accounts: []
	}
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.readConfig = function(filename, obj){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    return admin_file;
	}
	localFakeCommon.writeConfig = function(filename, data){
	    spy2();
	    assert.deepEqual(data,result_admin_file, "Incorrect result");
	}
	toTest.__set__("localConf", config);
	toTest.__set__("common", localFakeCommon);
        assert.equal(toTest.deleteAccount("2"), undefined, "Return value of function does not match");
	admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1"},
	    ]
	}
	result_admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1"},
	    ]
	}
	assert.equal(toTest.deleteAccount("2"), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledTwice, "readConfig not called correctly");
	assert.isTrue(spy2.calledOnce, "writeConfig not called correctly");
	done();
    });


    it('Shall replace account >', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1"},
		{"name": "Account2", "id": "2"}
	    ]
	}
	var result_admin_file = {
	    accounts: [
		{"name": "Account2", "id": "2"}
	    ]
	}
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.readConfig = function(filename, obj){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    return admin_file;
	}
	localFakeCommon.writeConfig = function(filename, data){
	    spy2();
	    assert.deepEqual(data,result_admin_file, "Incorrect result");
	}
	toTest.__set__("localConf", config);
	toTest.__set__("common", localFakeCommon);
            assert.equal(toTest.replaceAccounts({name: "Account2", "id": "2"}), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledOnce, "readConfig not called correctly");
	assert.isTrue(spy2.calledOnce, "writeConfig not called correctly");
	done();
    });


    it('Shall replace empty account >', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var admin_file = {
	    accounts: {}
	}
	var result_admin_file = {
	    accounts: []
	}
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.readConfig = function(filename, obj){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    return admin_file;
	}
	localFakeCommon.writeConfig = function(filename, data){
	    spy2();
	    assert.deepEqual(data,result_admin_file, "Incorrect result");
	}
	toTest.__set__("localConf", config);
	toTest.__set__("common", localFakeCommon);
            assert.equal(toTest.replaceAccounts({}), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledOnce, "readConfig not called correctly");
	assert.isTrue(spy2.calledOnce, "writeConfig not called correctly");
	done();
    });


    it('Shall replace all devices >', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1", "devices": [{"deviceId": "1", "name": "devicename"}]},
	    ]
	}
	var result_admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1", "devices": [{"deviceId": "2", "name": "devicename2"}]},
	    ]
	}
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.readConfig = function(filename, obj){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    return admin_file;
	}
	localFakeCommon.writeConfig = function(filename, data){
	    spy2();
	    assert.deepEqual(data,result_admin_file, "Incorrect result");
	}
	toTest.__set__("localConf", config);
	toTest.__set__("common", localFakeCommon);
        assert.equal(toTest.replaceAllDevices(0,[{"name": "devicename2", "deviceId": "2"}]), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledOnce, "readConfig not called correctly");
	assert.isTrue(spy2.calledOnce, "writeConfig not called correctly");
	done();
    });


    it('Shall not replace all devices >', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var admin_file = {
	    userid: "userid"
	}
	var result_admin_file = {
	    userid: "userid"
	}
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.readConfig = function(filename, obj){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    return admin_file;
	}
	localFakeCommon.writeConfig = function(filename, data){
	    spy2();
	    assert.deepEqual(data,result_admin_file, "Incorrect result");
	}
	toTest.__set__("localConf", config);
	toTest.__set__("common", localFakeCommon);
        assert.equal(toTest.replaceAllDevices(0,[{"name": "devicename2", "deviceId": "2"}]), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledOnce, "readConfig not called correctly");
	assert.isFalse(spy2.called, "writeConfig not called correctly");
	done();
    });


    it('Shall delete device >', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1", "devices": [
		    {"deviceId": "1", "name": "devicename"},
		    {"deviceId": "2", "name": "devicename2"}
		]},
	    ]
	}
	var result_admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1", "devices": [
		    {"deviceId": "1", "name": "devicename"}
		]},
	    ]
	}
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.readConfig = function(filename, obj){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    return admin_file;
	}
	localFakeCommon.writeConfig = function(filename, data){
	    spy2();
	    assert.deepEqual(data,result_admin_file, "Incorrect result");
	}
	toTest.__set__("localConf", config);
	toTest.__set__("common", localFakeCommon);
        assert.equal(toTest.removeDevice(0, 1), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledOnce, "readConfig not called correctly");
	assert.isTrue(spy2.calledOnce, "writeConfig not called correctly");
	done();
    });


    it('Shall replace device >', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1", "devices": [
		    {"deviceId": "1", "name": "devicename"},
		    {"deviceId": "2", "name": "devicename2"}
		]},
	    ]
	}
	var result_admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1", "devices": [
		    {"deviceId": "1", "name": "devicename"},
		    {"deviceId": "3", "name": "devicename3"}
		]},
	    ]
	}
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.readConfig = function(filename, obj){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    return admin_file;
	}
	localFakeCommon.writeConfig = function(filename, data){
	    spy2();
	    assert.deepEqual(data,result_admin_file, "Incorrect result");
	}
	toTest.__set__("localConf", config);
	toTest.__set__("common", localFakeCommon);
        assert.equal(toTest.replaceDevice(0, 1, {"deviceId": "3", "name": "devicename3"}), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledOnce, "readConfig not called correctly");
	assert.isTrue(spy2.calledOnce, "writeConfig not called correctly");
	done();
    });


    it('Shall add device >', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1", "devices": [
		    {"deviceId": "1", "name": "devicename"},
		]},
	    ]
	}
	var result_admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1", "devices": [
		    {"deviceId": "1", "name": "devicename"},
		    {"deviceId": "2", "name": "devicename2"}
		]},
	    ]
	}
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.readConfig = function(filename, obj){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    return admin_file;
	}
	localFakeCommon.writeConfig = function(filename, data){
	    spy2();
	    assert.deepEqual(data,result_admin_file, "Incorrect result");
	}
	toTest.__set__("localConf", config);
        toTest.__set__("common", localFakeCommon);
        assert.equal(toTest.addDevice(0, {"deviceId": "2", "name": "devicename2"}), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledOnce, "readConfig not called correctly");
	assert.isTrue(spy2.calledOnce, "writeConfig not called correctly");
	done();
    });


    it('Shall add device and create devices array >', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1"},
	    ]
	}
	var result_admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1", "devices": [
		    {"deviceId": "2", "name": "devicename2"}
		]},
	    ]
	}
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.readConfig = function(filename, obj){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    return admin_file;
	}
	localFakeCommon.writeConfig = function(filename, data){
	    spy2();
	    assert.deepEqual(data,result_admin_file, "Incorrect result");
	}
	toTest.__set__("localConf", config);
        toTest.__set__("common", localFakeCommon);
        assert.equal(toTest.addDevice(0, {"deviceId": "2", "name": "devicename2"}), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledOnce, "readConfig not called correctly");
	assert.isTrue(spy2.calledOnce, "writeConfig not called correctly");
	done();
    });


    it('Shall not find account structure >', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var admin_file = {
	    "userid": "userid"
	}
	var result_admin_file = {
	    "userid": "userid"
	}
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.readConfig = function(filename, obj){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    return admin_file;
	}
	localFakeCommon.writeConfig = function(filename, data){
	    spy2();
	    assert.deepEqual(data,result_admin_file, "Incorrect result");
	}
	toTest.__set__("localConf", config);
        toTest.__set__("common", localFakeCommon);
        assert.equal(toTest.addDevice(0, {"deviceId": "2", "name": "devicename2"}), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledOnce, "readConfig not called correctly");
	assert.isFalse(spy2.calledOnce, "writeConfig not called correctly");
	done();
    });


    it('Shall add component >', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1", "devices": [
		    {"deviceId": "1", "name": "devicename1", "components": [
			{"cid": "1", "name": "name"}]},
		    {"deviceId": "2", "name": "devicename2"}
		]},
	    ]
	}
	var result_admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1", "devices": [
		    {"deviceId": "1", "name": "devicename1", "components": [
			{"cid": "1", "name": "name"},
			{"cid": "2", "name": "name2"}
		    ]},
		    {"deviceId": "2", "name": "devicename2"}
		]},
	    ]
	}
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.readConfig = function(filename, obj){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    return admin_file;
	}
	localFakeCommon.writeConfig = function(filename, data){
	    spy2();
	    assert.deepEqual(data,result_admin_file, "Incorrect result");
	}
	toTest.__set__("localConf", config);
        toTest.__set__("common", localFakeCommon);
        assert.equal(toTest.addComponent(0, 0, {"cid": "2", "name": "name2"}), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledOnce, "readConfig not called correctly");
	assert.isTrue(spy2.calledOnce, "writeConfig not called correctly");
	done();
    });


    it('Shall add component array>', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1", "devices": [
		    {"deviceId": "1", "name": "devicename1"},
		    {"deviceId": "2", "name": "devicename2"}
		]},
	    ]
	}
	var result_admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1", "devices": [
		    {"deviceId": "1", "name": "devicename1", "components": [
			{"cid": "2", "name": "name2"}
		    ]},
		    {"deviceId": "2", "name": "devicename2"}
		]},
	    ]
	}
	var localFakeCommon = Object.assign({}, fakeCommon);
	localFakeCommon.readConfig = function(filename, obj){
	    spy();
	    assert.equal(filename, "/file/admin.js", "Wrong filename returned");
	    return admin_file;
	}
	localFakeCommon.writeConfig = function(filename, data){
	    spy2();
	    assert.deepEqual(data,result_admin_file, "Incorrect result");
	}
	toTest.__set__("localConf", config);
        toTest.__set__("common", localFakeCommon);
        assert.equal(toTest.addComponent(0, 0, {"cid": "2", "name": "name2"}), undefined, "Return value of function does not match");
	assert.isTrue(spy.calledOnce, "readConfig not called correctly");
	assert.isTrue(spy2.calledOnce, "writeConfig not called correctly");
	done();
    });


    it('Shall delete component >', function(done) {

	var spy = sinon.spy();
	var spy2 = sinon.spy();
	var config = {
	    admin_file: "admin.js"
	};
	var admin_file = {
	    accounts: [
		{"name": "Account1", "id": "1", "devices": [
		    {"deviceId": "1", "name": "devicename1", "components": [
			{"cid": "1", "name": "name"},
			{"cid": "2", "name": "name2"}
                    ]},
                    {"deviceId": "2", "name": "devicename2"}
                ]},
            ]
        }
        var result_admin_file = {
            accounts: [
                {"name": "Account1", "id": "1", "devices": [
                    {"deviceId": "1", "name": "devicename1", "components": [
                        {"cid": "1", "name": "name"}
                    ]},
                    {"deviceId": "2", "name": "devicename2"}
                ]},
            ]
        }
        var localFakeCommon = Object.assign({}, fakeCommon);
        localFakeCommon.readConfig = function(filename, obj){
            spy();
            assert.equal(filename, "/file/admin.js", "Wrong filename returned");
            return admin_file;
        }
        localFakeCommon.writeConfig = function(filename, data){
            spy2();
            assert.deepEqual(data,result_admin_file, "Incorrect result");
        }
        toTest.__set__("localConf", config);
        toTest.__set__("common", localFakeCommon);
        assert.equal(toTest.deleteComponent(0, 0, 1), undefined, "Return value of function does not match");
        assert.isTrue(spy.calledOnce, "readConfig not called correctly");
        assert.isTrue(spy2.calledOnce, "writeConfig not called correctly");
        done();
    });

});
