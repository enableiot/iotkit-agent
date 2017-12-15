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


var createAccount = function(jsonString) {
    logger.info("Starting createAccount ...");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    try {
        userAdminDataObj.body = JSON.parse(jsonString);
    } catch (e) {
        logger.error(common.errors["parseJsonError"].message + ": " + e);
        errorHandler(null, common.errors["parseJsonError"].code);
    }
    api.accounts.createAccount(userAdminDataObj,function(err, response) {
        if (!err && response) {
            logger.info("Info retrieved: ", response);
            userAdminData.addAccount(response);
        } else {
            logger.error(common.errors["responseError"].message + ": " + err);
            errorHandler(null, common.errors["responseError"].code);
        }
    });
};

var getAccountInfo = function(accountId) {
    logger.info("Starting getAccountInfo ...");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (targetAccount === null) {
        logger.error(common.errors["accountIdError"].message);
        errorHandler(null, common.errors["accountIdError"].code);
    }
    userAdminDataObj.accountId = targetAccount.id;
    api.accounts.getAccountInfo(userAdminDataObj, function(err, response) {
        if (!err && response) {
            logger.info("Info retrieved: ", response);
            userAdminData.updateAccount(response);
        } else {
            logger.error(common.errors["responseError"].message + ": " + err);
            errorHandler(null, common.errors["responseError"].code);
        }
    });
};

var updateAccount = function(accountId, jsonString) {
    logger.info("Starting updateAccountInfo ...");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (targetAccount === null) {
        logger.error(common.errors["accountIdError"].message);
        errorHandler(null, common.errors["accountIdError"].code);
    }
    try {
        userAdminDataObj.body = JSON.parse(jsonString);
    } catch (e) {
        logger.error(common.errors["parseJsonError"].message + ": " + e);
        errorHandler(null, common.errors["parseJsonError"].code);
    }
    userAdminDataObj.accountId = targetAccount.id;
    api.accounts.updateAccount(userAdminDataObj, function(err, response) {
        if (!err && response) {
            logger.info("Info retrieved: ", response);
            userAdminData.updateAccount(response);
        } else {
            logger.error(common.errors["responseError"].message + ": " + err);
            errorHandler(null, common.errors["responseError"].code);
        }
    });
};

var deleteAccount = function(accountId) {
    logger.info("Starting deleteAccount ...");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (targetAccount === null) {
        logger.error(common.errors["accountIdError"].message);
        errorHandler(null, common.errors["accountIdError"].code);
    }
    userAdminDataObj.accountId = targetAccount.id;
    api.accounts.deleteAccount(userAdminDataObj, function(err, response) {
        if (!err && response) {
            logger.info("Info retrieved: ", response);
            userAdminData.deleteAccount(targetAccount.id);
        } else {
            logger.error(common.errors["responseError"].message + ": " + err);
            errorHandler(null, common.errors["responseError"].code);
        }
    });
};

var getAccountActivationCode = function(accountId) {
    logger.info("Starting getAccountActivationCode ...");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (targetAccount === null) {
        logger.error(common.errors["accountIdError"].message);
        errorHandler(null, common.errors["accountIdError"].code);
    }
    userAdminDataObj.accountId = targetAccount.id;
    api.accounts.getAccountActivationCode(userAdminDataObj, function(err, response) {
        if (!err && response) {
            logger.info("Info retrieved: ", response);
        } else{
            logger.error(common.errors["responseError"].message + ": " + err);
            errorHandler(null, common.errors["responseError"].code);
        }
    });
};

var refreshAccountActivationCode = function(accountId) {
    logger.info("Starting refreshAccountActivationCode ...");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (targetAccount === null) {
        logger.error(common.errors["accountIdError"].message);
        errorHandler(null, common.errors["accountIdError"].code);
    }
    userAdminDataObj.accountId = targetAccount.id;
    api.accounts.refreshAccountActivationCode(userAdminDataObj, function(err, response) {
        if (!err && response) {
            logger.info("Info retrieved: ", response);
        } else{
            logger.error(common.errors["responseError"].message + ": " + err);
            errorHandler(null, common.errors["responseError"].code);
        }
    });
};

var changeAccountUser = function(accountId, userId, jsonString) {
    logger.info("Starting changeAccountUser ...");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (targetAccount === null) {
        logger.error(common.errors["accountIdError"].message);
        errorHandler(null, common.errors["accountIdError"].code);
    }
    if (jsonString) {
        try {
            userAdminDataObj.body = JSON.parse(jsonString);
        } catch (e) {
            logger.error(common.errors["parseJsonError"].message + ": " + e);
            errorHandler(null, common.errors["parseJsonError"].code);
        }
    }else{
        userAdminDataObj.body = {
            "id": userId,
            "accounts": {}
        };
        userAdminDataObj.body.accounts[targetAccount.id] = "user";
    }
    userAdminDataObj.accountId = targetAccount.id;
    userAdminDataObj.userId = userId;
    api.accounts.changeAccountUser(userAdminDataObj, function(err, response) {
        if (!err && response) {
            logger.info("Info retrieved: ", response);
        } else{
            logger.error(common.errors["responseError"].message + ": " + err);
            errorHandler(null, common.errors["responseError"].code);
        }
    });
    
};


var getAccountUsers = function(accountId) {
    logger.info("Starting getAccountUsers ...");
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    var targetAccount = userAdminTools.findAccountId(accountId, userAdminDataObj.accounts);
    if (targetAccount === null) {
        logger.error(common.errors["accountIdError"].message);
        errorHandler(null, common.errors["accountIdError"].code);
    }
    userAdminDataObj.accountId = targetAccount.id;
    api.accounts.getAccountUsers(userAdminDataObj, function(err, response) {
        if (!err && response) {
            logger.info("Info retrieved: ", response);
        } else{
            logger.error(common.errors["responseError"].message + ": " + err);
            errorHandler(null, common.errors["responseError"].code);
        }
    });
};

module.exports = {
    addCommand : function (program, errorHdl) {
        errorHandler = errorHdl;
        program
            .command('accounts.post <jsonString>')
            .description('|Create an account.|POST:/v1/api/accounts')
            .action(createAccount);
        program
            .command('accounts.get <accountId>')
            .description('|Get account information.|GET:/v1/api/accounts/{accountId}')
            .action(getAccountInfo);
        program
            .command('accounts.put <accountId> <jsonString>')
            .description('|Update an account.|PUT:/v1/api/accounts/{accountId}')
            .action(updateAccount);
        program
            .command('accounts.delete <accountId>')
            .description('|Delete an account.|DELETE:/v1/api/accounts/{accountId}')
            .action(deleteAccount);
        program
            .command('accounts.get.activationcode <accountId>')
            .description('|Get account activation code.|GET:/v1/api/accounts/{accountId}/activationcode')
            .action(getAccountActivationCode);
        program
            .command('accounts.put.refresh <accountId>')
            .description('|Renew account activation code.|PUT:/v1/api/accounts/{accountId}/activationcode/refresh')
            .action(refreshAccountActivationCode);
        program
            .command('accounts.put.users <accountId> <userId> [jsonString]')
            .description('|Change another users privileges for account. If jsonString is empty user is added with "user" role to account|PUT:/v1/api/accounts/{accontId}/users/{userId}')
            .action(changeAccountUser);
        program
            .command('accounts.get.users <accountId>')
            .description('|Get users of account.|GET:/v1/api/accounts/{accountId}/users')
            .action(getAccountUsers);
    }
};
