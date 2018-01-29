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

var assert = require('chai').assert,
    sinon = require('sinon'),
    rewire = require('rewire');
require('./commonTest.js');

var fileToTest = "../modules/alerts.js";

describe(fileToTest, function() {
    var toTest = rewire(fileToTest);
    toTest.__set__("logger", logger);
    account = {
        name: "AccountName",
        id: "321ef007-8449-477f-9ea0-d702d77e64b9",
        alerts:[
            alertObject
        ]
    };

    it('Shall get list of alerts for specified account and update cli-data file(getListOfAlerts)  >', function(done) {
        adminDataFile = {};

        dataFile = {
            userToken: "Thisis myToken",
            username: "test@example.com",
            accounts:[
                account
            ]
        }
 
        var test = function(object, callback) {
            object.token = token;
            assert.equal(object.accountId, account.id);
            assert.equal(object.userToken, token, "userToken is wrong");
            assert.equal(object.username, username, "username is wrong");
            callback(null, alertObject);
            assert.deepEqual(adminDataFile, dataFile);
            fakeUserAdminData.deleteAlert();
            done();
        }
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__('userAdminTools', fakeLibTools);
        fakeApi.alerts.getListOfAlerts = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__('common', fakeCommon);
        toTest.__get__("getListOfAlerts")(account.id);
    });

    it('Shall delete alerts for specified account and remove data in cli-data file(deleteListOfAlerts)  >', function(done) {
        adminDataFile = {};

        dataFile = {
            userToken: "Thisis myToken",
            username: "test@example.com",
            accounts:[
                account
            ]
        }
 
        var test = function(object, callback) {
            object.token = token;
            assert.equal(object.accountId, account.id);
            assert.equal(object.userToken, token, "userToken is wrong");
            assert.equal(object.username, username, "username is wrong");
            callback(null, alertObject);
            assert.deepEqual(adminDataFile, dataFile);
            fakeUserAdminData.deleteAlert();
            done();
        }
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__('userAdminTools', fakeLibTools);
        fakeApi.alerts.deleteListOfAlerts = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__('common', fakeCommon);
        toTest.__get__("deleteListOfAlerts")(account.id);
    });

    it('Shall get alert detail and store in cli-data file(getAlertDetails)  >', function(done) {
        adminDataFile = {};

        var dataFile = {
            userToken: token,
            username: username,
            accounts: [
                {
                    name: "AccountName",
                    id: "321ef007-8449-477f-9ea0-d702d77e64b9",
                    alerts:[
                        alertObject
                    ],
                    devices: [{
                        "deviceId": device.deviceId,
                        "name": device.name,
                        "components":[
                            component
                        ]
                    }
                    ]
                }
            ]
        };

        var test = function(object, callback) {
            object.token = token;
            assert.equal(object.accountId, account.id);
            assert.equal(object.userToken, token, "userToken is wrong");
            assert.equal(object.username, username, "username is wrong");
            callback(null, alertObject);
            assert.deepEqual(adminDataFile, dataFile);
            fakeUserAdminData.deleteAlert();
            done();
        }
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__('userAdminTools', fakeLibTools);
        fakeApi.alerts.getAlertDetails = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__('common', fakeCommon);
        toTest.__get__("getAlertDetails")(account.id, alertId)
    });

    it('Shall delete specific alert and remove in cli-data file(deleteAlert)  >', function(done) {
        adminDataFile = {};

        var dataFile = {
            userToken: token,
            username: username,
            accounts: [
                {
                    name: "AccountName",
                    id: "321ef007-8449-477f-9ea0-d702d77e64b9",
                    alerts:[
                    ],
                    devices: [{
                        "deviceId": device.deviceId,
                        "name": device.name,
                        "components":[
                            component
                        ]
                    }
                    ]
                }
            ]
        };

        var test = function(object, callback) {
            object.token = token;
            assert.equal(object.accountId, account.id);
            assert.equal(object.userToken, token, "userToken is wrong");
            assert.equal(object.username, username, "username is wrong");
            callback(null, alertObject);
            assert.deepEqual(adminDataFile, dataFile);
            fakeUserAdminData.deleteAlert();
            done();
        }
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__('userAdminTools', fakeLibTools);
        fakeApi.alerts.deleteAlert = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__('common', fakeCommon);
        toTest.__get__("deleteAlert")(account.id, alertId)
    });

    it('Shall change alert status to "Closed" Alert won\'t be active any more(closeAlert)  >', function(done) {
        adminDataFile = {};
        var alertTmp = alertObject;
        alertTmp.status = "Closed";
        var dataFile = {
            userToken: token,
            username: username,
            accounts: [
                {
                    name: "AccountName",
                    id: "321ef007-8449-477f-9ea0-d702d77e64b9",
                    alerts:[
                        alertTmp
                    ],
                    devices: [{
                        "deviceId": device.deviceId,
                        "name": device.name,
                        "components":[
                            component
                        ]
                    }
                    ]
                }
            ]
        };

        var test = function(object, callback) {
            object.token = token;
            assert.equal(object.accountId, account.id);
            assert.equal(object.userToken, token, "userToken is wrong");
            assert.equal(object.username, username, "username is wrong");
            callback(null, {});
            assert.deepEqual(adminDataFile, dataFile);
            fakeUserAdminData.deleteAlert();
            done();
        }
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__('userAdminTools', fakeLibTools);
        fakeApi.alerts.closeAlert = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__('common', fakeCommon);
        toTest.__get__("closeAlert")(account.id, alertId)
    });

    it('Shall Change status of the Alert. Status should have one of the following values: [\'New\', \'Open\', \'Closed\'](updateAlertStatus)  >', function(done) {
        adminDataFile = {};

        var alertTmp = alertObject;
        alertTmp.status = "Open"
        var dataFile = {
            userToken: token,
            username: username,
            accounts: [
                {
                    name: "AccountName",
                    id: "321ef007-8449-477f-9ea0-d702d77e64b9",
                    "alerts":[
                        alertTmp
                    ],
                    devices: [{
                        "deviceId": device.deviceId,
                        "name": device.name,
                        "components":[
                            component
                        ]
                    }
                    ]
                }
            ]
        };

        var test = function(object, callback) {
            object.token = token;
            assert.equal(object.accountId, account.id);
            assert.equal(object.userToken, token, "userToken is wrong");
            assert.equal(object.username, username, "username is wrong");
            callback(null, "Open");
            assert.deepEqual(adminDataFile, dataFile);
            fakeUserAdminData.deleteAlert();
            done();
        }
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__('userAdminTools', fakeLibTools);
        fakeApi.alerts.updateAlertStatus = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__('common', fakeCommon);
        toTest.__get__("updateAlertStatus")(account.id, alertId, "New")
    });

    it('Shall Add list of comments to the alert(addCommentsToAlert)  >', function(done) {
        adminDataFile = {};

        var alertTmp = alertObject;
        var body = [{
            "user": username,
            "timestamp": Date.parse(new Date()),
            "text": "This is a comment"
        }];
        alertTmp.comments = body;
        var dataFile = {
            userToken: token,
            username: username,
            accounts: [
                {
                    name: "AccountName",
                    id: "321ef007-8449-477f-9ea0-d702d77e64b9",
                    "alerts":[
                        alertTmp
                    ],
                    devices: [{
                        "deviceId": device.deviceId,
                        "name": device.name,
                        "components":[
                            component
                        ]
                    }
                    ]
                }
            ]
        };

        var test = function(object, callback) {
            object.token = token;
            assert.equal(object.accountId, account.id);
            assert.equal(object.userToken, token, "userToken is wrong");
            assert.equal(object.username, username, "username is wrong");
            assert.equal(object.body[0].text, body[0].text, "body text does not match");
            assert.equal(object.body[0].user, body[0].user, "body user does not match");
            callback(null, body);
            assert.deepEqual(adminDataFile, dataFile);
            fakeUserAdminData.deleteAlert();
            done();
        }
        toTest.__set__("userAdminData", fakeUserAdminData);
        toTest.__set__('userAdminTools', fakeLibTools);
        fakeApi.alerts.addCommentsToAlert = test;
        toTest.__set__("api", fakeApi);
        toTest.__set__('common', fakeCommon);
        toTest.__get__("addCommentsToAlert")(account.id, alertId, "This is a comment")
    });
});