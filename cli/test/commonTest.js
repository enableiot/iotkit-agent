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


global.adminDataFile = {};
global.token = "Thisis myToken";
global.username = "test@example.com";
global.password = "password";
global.userId = "20000";
global.email = "test2@example.com";
global.new_password ="new password";
global.jsonString='{"attributes": {"reading": "digital"}}';
global.jsonStringError='{"attributes": {"reading": "digital"}';
global.jsonStringSearchAdvanced = '{"returnedMeasureAttributes": [ "reading" ] }'
global.account = {
    name: "AccountName",
    id: "321ef007-8449-477f-9ea0-d702d77e64b9"
};
global.account2 = {
    name: "AccountName2",
    id: "321ef007-8449-477f-9ea0-d702d77e64b8"
};
global.deviceId = "24-a5-80-21-5b-30";
global.deviceId2 = "24-a5-80-21-5b-31";
global.alertId = "75"
global.gatewayId = deviceId;
global.deviceName = "Device #1";
global.deviceName2 = "Device #2";
global.cid = "436e7e74-6771-4898-9057-26932f5eb7e1";
global.device = {
    "deviceId": deviceId,
    "name": deviceName
};
global.device2 = {
    "deviceId": deviceId2,
    "name": deviceName2
};
global.alertObject = {
    "accountId": "321ef007-8449-477f-9ea0-d702d77e64b9",
    "alertId": "75",
    "deviceId": "00-00-00-00-a8-9c",
    "ruleId": 6832,
    "ruleName": "rule 2 - basic condition new",
    "priority": "Low",
    "triggered": 1402580459000,
    "created": 1411130946286,
    "naturalLangAlert": "temperature > 17.2",
    "conditions": [
        {
            "sequence": 1,
            "condition": "temperature > 17.2"
        }
    ],
    "status": "New",
    "updated": 1411130946286,
    "_id": "541c2642b3700bcbe9c76fc5"
};
global.component = { 
    "cid": cid,
    "name": "temp",
    "type": "temperature.v1.0"
}
global.on = 1354741967799;
global.value = "22.5";
global.from = 1407979291860;
global.to   = 1407979292860;
global.filenameToSave = "value"
global.logger  = {
    info : function() {},
    error : function() {},
    debug : function() {}
};
console.debug = function() {
    console.log(arguments);
};


global.fakeUserAdminData = {
    initializeUserAdminBaseData: function(username, token) {
        adminDataFile = {}
    },
    saveUserAdminBaseData: function(username, token) {
        adminDataFile.username = username;
        adminDataFile.userToken = token;
    },
    loadUserAdminBaseData: function() {
        adminDataFile = {}
        this.addAccount(account);
        this.addDevice(0, device);
        this.addComponent(0, 0, component);
        this.saveUserAdminBaseData(username, token);
        return Object.assign({}, adminDataFile);
    },
    saveUserAdminData: function(key, value) {
        adminDataFile[key] = value;
    },
    addAccount: function(account) {
        adminDataFile.accounts = [];
        adminDataFile.accounts.push(account);
    },
    updateAccount: function(account) {
        this.addAccount(account);
    },
    deleteAccount: function(account) {
        adminDataFile.accounts = [];
    },
    replaceAllDevices: function(index, device) {
        adminDataFile.accounts[0].devices = [];
        adminDataFile.accounts[0].devices.push(device);
    },
    addDevice: function(index, device) {
        this.replaceAllDevices(index, device);
    },
    replaceDevice: function(accountIndex, deviceIndex, device) {
        this.replaceAllDevices(deviceIndex, device);
    },
    removeDevice: function(accountIndex, deviceIndex) {
        adminDataFile.accounts = [];
        adminDataFile.accounts.push(account);
        adminDataFile.accounts[0].devices = [];
    },
    addComponent: function(accountIndex, deviceIndex, component) {
        adminDataFile.accounts[0].devices[0].components = [];
        adminDataFile.accounts[0].devices[0].components.push(component);
    },
    deleteComponent: function(accountIndex, DeviceIndex, cidIndex) {
        adminDataFile.accounts[0].devices[0].components = [];
    },
    replaceAllAlerts :function(index, alert) {
        adminDataFile.accounts[0].alerts = [];
        adminDataFile.accounts[0].alerts.push(alert);
    },
    deleteAllAlerts: function(index) {
        adminDataFile.accounts[0].alerts = [];
    },
    addAlert: function(index, alert) {
        this.replaceAllAlerts(index, alert);
    },
    replaceAlert: function(accountIndex, alertIndex, alert) {
        this.replaceAllAlerts(alertIndex, alert);
    },
    closeAlert: function(accountIndex, alertIndex) {
        adminDataFile.accounts[0].alerts = [];
        adminDataFile.accounts[0].alerts[0] = alertObject;
        adminDataFile.accounts[0].alerts[0].status = "Closed";
    },
    updateAlertStatus: function(accountIndex, alertIndex, statusName) {
        adminDataFile.accounts[0].alerts = [];
        adminDataFile.accounts[0].alerts[0] = alertObject;
        adminDataFile.accounts[0].alerts[0].status = statusName;
    },
    addCommentsToAlert: function(accountIndex, alertIndex, commentsList) {
        adminDataFile.accounts[0].alerts = [];
        adminDataFile.accounts[0].alerts[0] = alertObject;
        adminDataFile.accounts[0].alerts[0].comments = commentsList;
    },
    deleteAlert: function(accountIndex, alertIndex, alert) {
        delete adminDataFile.accounts[0].alerts;
    }
}


global.fakeApi = {
    data:     {},
    users:    {},
    accounts: {},
    devices:  {},
    auth:     {},
    alerts:   {}
}


global.fakeLibTools = {
    findAccountId: function(accountId, accounts) {
        return {id: accountId, index: 0};
    },
    findDeviceId: function(deviceId, account) {
        return {id: deviceId, index: 0};
    },
    findCid: function(cid, devices) {
        return {id: cid, index: 0};
    },
    findAlertId: function(alertId, account) {
        return {id: alertId, index: 0};
    },
    isValidStatusName: function(statusName) {
        if(("New" === statusName)||("Open" === statusName)||("Closed" === statusName)) {
            return true;
        } else {
            return false;
        }
    },
}

global.fakeLibToolsError = {
    findAccountId: function(accountId, accounts) {
        return null;
    },
    findDeviceId: function(deviceId, accounts) {
        return null;
    },
    findCid: function(deviceId, accounts) {
        return null;
    } 
}

global.fakeCommon = {
    errors: {
        "ok":             {"code": 0, "message": "OK"},
        "responseError":  {"code": 1, "message": "Server Response Error"},
        "parseJsonError": {"code": 2, "message": "Can't parse JSON"},
        "accountIdError": {"code": 3, "message": "Account ID not found in local file"},
        "deviceIdError":  {"code": 4, "message": "Device ID not found in local file"},
        "cidError":       {"code": 5, "message": "Component ID not found in local file"},
        "fsError":        {"code": 6, "message": "Filesystem error"},
        "alertIdError":   {"code": 7, "message": "Alert Id not found in local file"},
        "staNameError":   {"code": 8, "message": "Alert Status name is Error"},
        "usernameError":  {"code": 9, "message": "user name not found in local file"}
    }
}

global.FakeDate = function() {
}

FakeDate.prototype.getTime = function() {
    return on;
}

global.fakeFs = {
    readFileSync:  function(filename, options) {
        if (filename === "value.txt" && options.encoding === "utf8") {
            return String(value);
        } else {
            return -1;
        }
    }
}
global.fakeFsError = {
    readFileSync:  function(filename, options) {
        throw new Error("Cannot load from file");
    }
}

global.fakeUuid = {
    v4: function() {
        return "436e7e74-6771-4898-9057-26932f5eb7e1";
    }
}
