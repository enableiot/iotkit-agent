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
    common = require("../lib/common"),
    userAdminData = require("../lib/cli-data");
var errorHandler = {};


var getUserInfo = function(){
    logger.info("Starting getUserInfo ...");
    var user_admin_data = userAdminData.loadUserAdminBaseData();
    api.users.getUserInfo(user_admin_data, function(err, response){
	if (!err && response){
	    logger.info("Info retrieved: ", response);
	}
	else{
	    logger.error(common.errors["responseError"].message + ": " + err);
	    errorHandler(null, common.errors["responseError"].code);
	}
    });
};


var updateUserInfo = function(jsonString){
    logger.info("Starting UpdateUserInfo with jsonString", jsonString, "...");
    var user_admin_data = userAdminData.loadUserAdminBaseData();
    try {
	user_admin_data.body = JSON.parse(jsonString);
    } catch (e) {
	logger.error(common.errors["parseJsonError"].message + ": " + e);
	errorHandler(null, common.errors["parseJsonError"].code);
    }
    api.users.updateUserInfo(user_admin_data, function(err, response){
	if (!err && response){
	    logger.info("Info retrieved: ", response);
	}
	else{
	    logger.error(common.errors["responseError"].message + ": " + err);
	    errorHandler(null, common.errors["responseError"].code);
	}
    });
};


var deleteUser = function(userId){
    logger.info("Starting Delete User ...");
    var user_admin_data = userAdminData.loadUserAdminBaseData();
    user_admin_data.deleteUserId = userId;
    api.users.deleteUser(user_admin_data, function(err, response){
	if (!err && response){
	    logger.info("Info retrieved: ", response);
	}
	else{
	    logger.error(common.errors["responseError"].message + ": " + err);
	    errorHandler(null, common.errors["responseError"].code);
	}
    });
};


var requestUserPasswordChange = function(emailAddress){
    logger.info("Starting requestPasswordChange ...");
    var user_admin_data = userAdminData.loadUserAdminBaseData();
    user_admin_data.body = {email: emailAddress};
    user_admin_data.userToken = null;
    api.users.requestUserPasswordChange(user_admin_data, function(err, response){
	if (!err && response){
	    logger.info("Info retrieved: ", response);
	}
	else{
	    logger.error(common.errors["responseError"].message + ": " + err);
	    errorHandler(null, common.errors["responseError"].code);
	}
    });
};


var updateUserPassword = function(token, new_password){
    logger.info("Starting updateUserPassword ...");
    var user_admin_data = userAdminData.loadUserAdminBaseData();
    user_admin_data.userToken = null;
    user_admin_data.body = {token:  token, password: new_password};
    api.users.updateUserPassword(user_admin_data, function(err, response){
	if (!err && response){
	    logger.info("Info retrieved: ", response);
	}
	else{
	    logger.error(common.errors["responseError"].message + ": " + err);
	    errorHandler(null, common.errors["responseError"].code);
	}
    });
};


var changeUserPassword = function(currentPW, newPW){
    logger.info("Starting changeUserPassword ...");
    var user_admin_data = userAdminData.loadUserAdminBaseData();
    user_admin_data.body = {currentpwd: currentPW, password: newPW};
    api.users.changeUserPassword(user_admin_data, function(err, response){
	if (!err && response){
	    logger.info("Info retrieved: ", response);
	}
	else{
	    logger.error(common.errors["responseError"].message + ": " + err);
	    errorHandler(null, common.errors["responseError"].code);
	}
    });
};


var requestUserActivation = function(email){
    logger.info("Starting requestUserActivation ...");
    var user_admin_data = userAdminData.loadUserAdminBaseData();
    user_admin_data.userToken = null;
    user_admin_data.body = {email: email};
    api.users.requestUserActivation(user_admin_data, function(err, response){
	if (!err && response){
	    logger.info("Info retrieved: ", response);
	}
	else{
	    logger.error(common.errors["responseError"].message + ": " + err);
	    errorHandler(null, common.errors["responseError"].code);
	}
    });
};

var addUser = function(email, password){
    logger.info("Starting addUser ...");
    var user_admin_data = userAdminData.loadUserAdminBaseData();
    user_admin_data.body = {"email": email, "password": password};
    api.users.addUser(user_admin_data,function(err, response){
	if (!err && response){
	    logger.info("Info retrieved: ", response);
	}
	else{
	    logger.error(common.errors["responseError"].message + ": " + err);
	    errorHandler(null, common.errors["responseError"].code);
	}
    });
};


var activateUser = function(token){
    logger.info("Starting activate ...");
    var user_admin_data = userAdminData.loadUserAdminBaseData();
    user_admin_data.userToken = null;
    user_admin_data.body = {"token": token};
    api.users.activateUser(user_admin_data,function(err, response){
	if (!err && response){
	    logger.info("Info retrieved: ", response);
	}
	else{
	    logger.error(common.errors["responseError"].message + ": " + err);
	    errorHandler(null, common.errors["responseError"].code);
	}
    });
};


module.exports = {
    addCommand : function (program, errorHdl) {
	errorHandler = errorHdl;
        program
            .command('users.get')
            .description('|Get user details.|GET:/v1/api/users/{userId}')
            .action(getUserInfo);
        program
            .command('users.put <jsonString>')
            .description('|Update user details.|PUT:/v1/api/users/{userId}')
            .action(updateUserInfo);
        program
            .command('users.delete <userId>')
            .description('|Delete user.|DELETE:/v1/api/users/{userId}')
            .action(deleteUser);
	program
            .command('users.post.forgot_password <email-address>')
            .description('|Request new password when password is lost. Request will be sent to email-address.|POST:/v1/api/users/forgot_password')
            .action(requestUserPasswordChange);
	program
            .command('users.put.forgot_password <token> <new-password>')
            .description('|Update password with received token provided by email.|PUT:/v1/api/users/forgot_password.')
            .action(updateUserPassword);
	program
            .command('users.put.change_password <currentPW> <newPW>')
            .description('|Update password. User is identified by email.|PUT:/v1/api/users/{email}/change_password')
            .action(changeUserPassword);
	program
            .command('users.put.request_user_activation <email>')
            .description('|Request user activatation by email.|PUT:/v1/api/users/request_user_activation')
            .action(requestUserActivation);
	program
            .command('users.post <email> <password>')
            .description('|Create user in DB and send activation email.|POST:/v1/api/users')
            .action(addUser);
	program
            .command('users.post.activate <token>')
            .description('|Send activation token which has been received by email.|POST:/v1/api/users/activate')
            .action(activateUser);
	
    }
};
