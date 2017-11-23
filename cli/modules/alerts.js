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
    logger = require("oisp-sdk-js").lib.logger.init(),
    userAdminTools = require("../lib/cli-tools"),
    userAdminData = require("../lib/cli-data"),
    common = require("../lib/common");

var errorHandler = {};

var getListOfAlerts = function(accountId) {
    logger.info("Starting getListOfAlerts ...");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (targetAccount === null) {
        logger.error(common.errors["accountIdError"].message);
        errorHandler(null, common.errors["accountIdError"].code);
    }
    userAdminDataObj.accountId = targetAccount.id;
    api.alerts.getListOfAlerts(userAdminDataObj, function(err, response) {
        if (!err && response) {
            logger.info("Info retrieved: ", response);
            userAdminData.replaceAllAlerts(targetAccount.index, response);
        } else {
            logger.error(common.errors["responseError"].message + ": " + err);
            errorHandler(null, common.errors["responseError".code]);
        }
    });
};

var getAlertDetails = function(accountId, alertId) {
    logger.info("Starting getDetailOfAlerts");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (targetAccount === null) {
        logger.error(common.errors["accountIdError"].message);
        errorHandler(null, common.errors["accountIdError"].code);
    }
    var targetAlert = userAdminTools.findAlertId(alertId, userAdminDataObj.accounts[targetAccount.index]);
    if (null === targetAlert) {
        logger.info("no alert found in local file");
        userAdminDataObj.alertId = alertId;
    } else {
        logger.info("alert found in local file");
        userAdminDataObj.alertId = targetAlert.id;
    }
    userAdminDataObj.accountId = targetAccount.id;
    api.alerts.getAlertDetails(userAdminDataObj, function(err, response) {
        if (!err && response) {
            logger.info("Info retrieved: ", response);
            userAdminData.replaceAlert(targetAccount.index, targetAlert.index, response);
        } else {
            logger.error(common.errors["responseError"].message + ": " + err);
            errorHandler(null, common.errors["responseError".code]);
        }
    });
};

var closeAlert = function(accountId, alertId) {
    logger.info("Starting closeAlert");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (targetAccount === null) {
        logger.error(common.errors["accountIdError"].message);
        errorHandler(null, common.errors["accountIdError"].code);
    }
    userAdminDataObj.accountId = targetAccount.id;
    var targetAlert = userAdminTools.findAlertId(alertId, userAdminDataObj.accounts[targetAccount.index]);
    if (null === targetAlert) {
        logger.info("no alert found in local file");
        userAdminDataObj.alertId = alertId;
    } else {
        logger.info("alert found in local file");
        userAdminDataObj.alertId = targetAlert.id;
    }
    api.alerts.closeAlert(userAdminDataObj, function(err, response) {
        if (!err && response) {
            userAdminData.closeAlert(targetAccount.index, targetAlert.index);
            logger.info("Info retrieved: ", response);
        } else {
            logger.error(common.errors["responseError"].message + ": " + err);
            errorHandler(null, common.errors["responseError".code]);
        }
    });
};

var updateAlertStatus = function(accountId, alertId, statusName) {
    logger.info("Starting updateAlertStatus");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (targetAccount === null) {
        logger.error(common.errors["accountIdError"].message);
        errorHandler(null, common.errors["accountIdError"].code);
    }
    userAdminDataObj.accountId = targetAccount.id;
    var targetAlert = userAdminTools.findAlertId(alertId, userAdminDataObj.accounts[targetAccount.index]);
    if (null === targetAlert) {
        logger.info("no alert found in local file");
        userAdminDataObj.alertId = alertId;
    } else {
        logger.info("alert found in local file");
        userAdminDataObj.alertId = targetAlert.id;
    }
    if (userAdminTools.isValidStatusName(statusName)) {
        userAdminDataObj.statusName = statusName;
    } else {
        logger.error(common.errors["staNameError"].message);
        errorHandler(null, common.errors["staNameError"].code);
    }
    api.alerts.updateAlertStatus(userAdminDataObj, function(err, response) {
        if (!err && response) {
            userAdminData.updateAlertStatus(targetAccount.index,targetAlert.index, statusName);
            logger.info("Info retrieved: ", response);
        } else {
            logger.error(common.errors["responseError"].message + ": " + err);
            errorHandler(null, common.errors["responseError".code]);
        }
    });
};

var addCommentsToAlert = function(accountId, alertId, comment) {
    logger.info("Starting AddCommentsToAlert");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (targetAccount === null) {
        logger.error(common.errors["accountIdError"].message);
        errorHandler(null, common.errors["accountIdError"].code);
    }
    var userName = userAdminDataObj.username;
    if(null === userName) {
        logger.error(common.errors["usernameError"].message);
        errorHandler(null, common.errors["usernameError"].code); 
    }
    userAdminDataObj.accountId = targetAccount.id;
    var targetAlert = userAdminTools.findAlertId(alertId, userAdminDataObj.accounts[targetAccount.index]);
    if (null === targetAlert) {
        logger.info("no alert found in local file");
        userAdminDataObj.alertId = alertId;
    } else {
        logger.info("alert found in local file");
        userAdminDataObj.alertId = targetAlert.id;
    }
    var timeStamp = Date.parse(new Date());
    userAdminDataObj.body = [{
        "user": userAdminDataObj.username,
        "timestamp": timeStamp,
        "text": comment
    }];
    api.alerts.addCommentsToAlert(userAdminDataObj, function(err, response) {
        if (!err && response) {
            userAdminData.addCommentsToAlert(targetAccount.index, targetAlert.index, userAdminDataObj.body);
            logger.info("Info retrieved: ", response);
        } else {
            logger.error(common.errors["responseError"].message + ": " + err);
            errorHandler(null, common.errors["responseError".code]);
        }
    });
};

module.exports = {
    addCommand : function(program, errorHdl) {
        errorHandler = errorHdl;
        program
            .command('alerts.get <accountId>')
            .description('|Get all alerts of the accound.|GET:/v1/api/accounts/{accoundId}/alerts')
            .action(getListOfAlerts);
        program
            .command('alerts.get.details <accountId> <alertId>')
            .description('|Get specific alert details connected with the account.|GET:/v1/api/account/{accountId}/alerts/{alertId}')
            .action(getAlertDetails);
        program
            .command('alerts.put.close <accoutId> <alertId>')
            .description('|Change alert status to - "Closed" Alert won\'t be active any more.|PUT:/v1/api/account/{accountId}/alerts/{alertId}/reset')
            .action(closeAlert);
        program
            .command('alerts.put.update <accountId> <alertId> <statusName>')
            .description('|Put Change status of the Alert. Status should have one of the following values: [\'New\', \'Open\', \'Closed\'].|PUT/v1/api/account/{accountId}/alerts/{alertId}/status/{statusName}')
            .action(updateAlertStatus);
        program
            .command('alerts.post.comments <accountId> <alertId>')
            .description('|Add list of comments to the alert.|POST:/v1/api/account/{accountId}/alerts/{alertId}/comments')
            .action(addCommentsToAlert);
    }
};
