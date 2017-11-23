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

var common = require('./common');
var fs     = require('fs');
var logger = require('oisp-sdk-js').lib.logger.init();
var localConf = require('../config');

module.exports = {

    // @brief gets config full file name (with absolute path) or logs error
    // @returns filename if found or throws error
    getConfigFileName: function() {
        var config = localConf;
        if (!config["admin_file"]) {
            logger.error("Error: No user_admin file to place to store token. user_admin_file not specified in global config!");
            throw new Error("No admin file found.");
        }
        var userAdminConfFile = config["admin_file"];
        var absoluteUserAdminConfFile = common.getFileFromDataDirectory(userAdminConfFile);
        return absoluteUserAdminConfFile;
    },

    
    // @brief saves data to user-admin config file
    // @rreturns 1 if successful, 0 if not
    saveUserAdminBaseData: function(username, token) {
        this.saveUserAdminData("username", username);
        this.saveUserAdminData("userToken", token);
    },


    saveUserAdminData: function(key, data) {
        var userAdminConfFile = this.getConfigFileName();
        common.saveToConfig(userAdminConfFile, key, data);
    },

    
    // @brief loads data from user-admin config file
    // @returns object containing data if successfuly, {} if not
    loadUserAdminBaseData: function() {
        var userAdminConfFile = this.getConfigFileName();
        var config_object = common.readConfig(userAdminConfFile);
        if (!config_object) {
            logger.error("Could not load user admin base data!");
            throw new Error("Could not load user admin base data.");
        }
        return config_object;
    },
    
    // @brief initializes (i.e. creates) user-admin config file
    // deletes old data
    initializeUserAdminBaseData: function() {
        var userAdminConfFile = this.getConfigFileName();
        if (fs.existsSync(userAdminConfFile)) {
            fs.unlinkSync(userAdminConfFile);
        }
        common.initializeFile(userAdminConfFile, {username: "username", userToken: "userToken"});
    },

    addAccount: function(accountData) {
        var userAdminConfFile = this.getConfigFileName();
        var data = common.readConfig(userAdminConfFile);
        if (! data["accounts"]) {
            data.accounts = [];
        }
        data.accounts.push(accountData);
        common.writeConfig(userAdminConfFile, data);
    },
    updateAccount: function(accountData) {
        var userAdminConfFile = this.getConfigFileName();
        var data = common.readConfig(userAdminConfFile);

        if (! data.accounts ) {
            return;
        }
        var index = data.accounts.findIndex( function(i) {
            return (i.id === accountData.id);
        });
        if (index >=0) {
            data.accounts[index] = accountData;
        }
        common.writeConfig(userAdminConfFile, data);
    },
    deleteAccount: function(accountId) {
        var userAdminConfFile = this.getConfigFileName();
        var data = common.readConfig(userAdminConfFile);
        if (! data.accounts ) {
            return;
        }
        var index = data.accounts.findIndex( function(i) {
            return (i.id === accountId);
        });
        if (index >=0) {
            data.accounts.splice(index, 1);
        }
        common.writeConfig(userAdminConfFile, data);
    },
    replaceAccounts: function(accounts) {
        var userAdminConfFile = this.getConfigFileName();
        var data = common.readConfig(userAdminConfFile);
        if (Object.keys(accounts).length === 0) {
            accounts = [];
        }
        if (! Array.isArray(accounts)) {
            accounts = [ accounts ];
        }
        data.accounts = accounts;
        common.writeConfig(userAdminConfFile, data);
    },

    
    // @brief replaces all devices in the respective account data
    // @param accountIndex index of account in user-admin-data
    // @param devices list of devices
    replaceAllDevices: function(accountIndex, devices) {
        var userAdminConfFile = this.getConfigFileName();
        var data = common.readConfig(userAdminConfFile);
        if (! data["accounts"]) {
            logger.info("Warning: no accounts found. Nothing updated.");
            return;
        }
        data["accounts"][accountIndex].devices = devices;
        common.writeConfig(userAdminConfFile, data);
    },

    
    // @brief replaces a devices in the respective account data. Assumes that account/device exists
    // @param accountIndex index of account in user-admin-data
    // @param deviceIndex index of the device to replace
    // @param device device object
    replaceDevice: function(accountIndex, deviceIndex, device) {
        var userAdminConfFile = this.getConfigFileName();
        var data = common.readConfig(userAdminConfFile);
        data.accounts[accountIndex].devices[deviceIndex] = device;
        common.writeConfig(userAdminConfFile, data);
    },

    
    // @brief removes a devices in the respective account data. Assumes that account/device exists
    // @param accountIndex index of account in user-admin-data
    // @param deviceIndex index of the device to replace
    removeDevice: function(accountIndex, deviceIndex) {
        var userAdminConfFile = this.getConfigFileName();
        var data = common.readConfig(userAdminConfFile);
        data.accounts[accountIndex].devices.splice(deviceIndex,1);
        common.writeConfig(userAdminConfFile, data);
    },
    
    // @brief add a new device entry in the respective account data
    // @param accountIndex index of account in user-admin-data
    // @param device device object
    addDevice: function(accountIndex, device) {
        var userAdminConfFile = this.getConfigFileName();
        var data = common.readConfig(userAdminConfFile);
        if (! data["accounts"]) {
            logger.info("Warning: no accounts found. Nothing updated.");
            return;
        }
        if (! data["accounts"][accountIndex].devices) {
            data["accounts"][accountIndex].devices = [];
        }
        data["accounts"][accountIndex].devices.push(device);
        common.writeConfig(userAdminConfFile, data);
    },

    // @brief add a new component to a device - assumes that account and device index exists
    // @param accountIndex index of account in user-admin-data
    // @param deviceIndex device index
    // @param component component to insert
    addComponent: function(accountIndex, deviceIndex, component) {
        var userAdminConfFile = this.getConfigFileName();
        var data = common.readConfig(userAdminConfFile);

        if (! data.accounts[accountIndex].devices[deviceIndex].components) {
            data.accounts[accountIndex].devices[deviceIndex].components = [];
        }
        data.accounts[accountIndex].devices[deviceIndex].components.push(component);
        common.writeConfig(userAdminConfFile, data);
    },

    // @brief delete a component of a device - assumes that account, device and cid index exists
    // @param accountIndex index of account in user-admin-data
    // @param deviceIndex device index
    // @param cid component index
    deleteComponent: function(accountIndex, deviceIndex, componentIndex) {
        var userAdminConfFile = this.getConfigFileName();
        var data = common.readConfig(userAdminConfFile);
        data.accounts[accountIndex].devices[deviceIndex].components.splice(componentIndex,1);
        common.writeConfig(userAdminConfFile, data);
    },

    // @brief replaces all alerts in the respective account data
    // @param accountIndex index of account in user-admin-data
    // @param alerts list of alerts
    replaceAllAlerts: function(accountIndex, alerts) {
        var userAdminConfFile = this.getConfigFileName();
        var data = common.readConfig(userAdminConfFile);
        if (! data["accounts"]) {
            logger.info("Warning: no accounts found. Nothing updated.");
            return;
        }
        data["accounts"][accountIndex].alerts = alerts;
        common.writeConfig(userAdminConfFile, data);
    },

    // @brief replaces an alert in the respective account data. Assumes that account/alert exists
    // @param accountIndex index of account in user-admin-data
    // @param alertIndex index of the alert to replace
    // @param alert alert object
    replaceAlert: function(accountIndex, alertIndex, alertObject) {
        var userAdminConfFile = this.getConfigFileName();
        var data = common.readConfig(userAdminConfFile);
        if(alertIndex === undefined) {
            data.accounts[accountIndex].alerts.push(alertObject);
        } else {
            data.accounts[accountIndex].alerts[alertIndex] = alertObject;
        }
        common.writeConfig(userAdminConfFile, data);
    },

    // @brief Change alert status to - "Closed". Alert won't be active any more.
    // @param accountIndex index of account in user-admin-data
    // @param alertIndex index of the alert to replace
    closeAlert: function(accountIndex, alertIndex) {
        var userAdminConfFile = this.getConfigFileName();
        var data = common.readConfig(userAdminConfFile);
        if (undefined === alertIndex) {
            logger.info("no alert found on local file, doesn't update alert on local file");
        } else {
            data.accounts[accountIndex].alert[alertIndex].status = "Closed";
        }
        common.writeConfig(userAdminConfFile, data);
    },

    // @brief Change alert status to - "Closed". Alert won't be active any more.
    // @param accountIndex index of account in user-admin-data
    // @param alertIndex index of the alert to replace
    // @param statusName Status should have one of the following values: [\'New\', \'Open\', \'Closed\']
    updateAlertStatus: function(accountIndex, alertIndex, statusName) {
        var userAdminConfFile = this.getConfigFileName();
        var data = common.readConfig(userAdminConfFile);
        if (undefined === alertIndex) {
            logger.info("no alert found on local file, doesn't update alert on local file");
        } else {
            data.accounts[accountIndex].alert[alertIndex].status = statusName;
        }
        common.writeConfig(userAdminConfFile, data);
    },

    // @brief Add list of comments to the alert.
    // @param accountIndex index of account in user-admin-data
    // @param alertIndex index of the alert to replace
    // @param commentsList the comments which should be add to alert
    addCommentsToAlert: function(accountIndex, alertIndex, commentsList) {
        var userAdminConfFile = this.getConfigFileName();
        var data = common.readConfig(userAdminConfFile);
        if (undefined === alertIndex) {
            logger.info("no alert found on local file, doesn't update alert on local file");
        } else {
            data.accounts[accountIndex].alert[alertIndex].comments.push(commentsList);
        }
        common.writeConfig(userAdminConfFile, data);
    },
};
