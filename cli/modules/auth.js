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

var api = require("oisp-sdk-js").api.rest,
    logger = require("oisp-sdk-js").lib.logger.init(),
    common = require("../lib/common"),
    userAdminData = require("../lib/cli-data");
var errorHandler = {};

var getAuthToken = function(username, password) {
    logger.info("Starting getUserToken ...");
    userAdminData.initializeUserAdminBaseData();
    api.auth.getAuthToken({body: {username: username, password: password}}, function(err, response) {
        if (!err && response) {
            logger.info("Retrieved user token :", response.token);
            userAdminData.saveUserAdminBaseData(username, response.token);
        } else {
            logger.error(common.errors["responseError"].message + ": " + err);
            errorHandler(null, common.errors["responseError"].code);
        }
    });
};

var getAuthTokenInfo = function() {
    logger.info("Starting getUserTokenInfo ...");
    var user_admin_data = userAdminData.loadUserAdminBaseData();
    api.auth.getAuthTokenInfo(user_admin_data, function(err, response) {
        if (!err && response) {
            logger.info("Info retrieved: ", JSON.stringify(response));
            if (! Object.keys(response.payload.accounts).length) {
                response.payload.accounts = []; //should be array to apply array methods later
            }
            userAdminData.saveUserAdminData("accounts", response.payload.accounts);
            userAdminData.saveUserAdminData("userId", response.payload.sub);
        } else {
            logger.error(common.errors["responseError"].message + ": " + err);
            errorHandler(null, common.errors["responseError"].code);
        }
    });
};

var getAuthUserInfo = function() {
    logger.info("Starting getUserInfo ...");
    var user_admin_data = userAdminData.loadUserAdminBaseData();
    api.auth.getAuthUserInfo(user_admin_data, function(err, response) {
        if (!err && response) {
            logger.info("Info retrieved: ", response);
            userAdminData.saveUserAdminData("userId", response.id);
        } else {
            logger.error(common.errors["responseError"].message + ": " + err);
            errorHandler(null, common.errors["responseError"].code);
        }
    });
};


module.exports = {
    addCommand : function (program, errorHdl) {
        errorHandler = errorHdl;
        program
            .command('auth.post.token <username> <password>')
            .description('|Get JWT user-token for user.|POST:/v1/api/auth/token ')
            .action(getAuthToken);
        program
            .command('auth.get.tokeninfo')
            .description('|Get user token info of earlier acquired user-token.|GET:/v1/api/auth/tokenInfo')
            .action(getAuthTokenInfo);
        program
            .command('auth.get.me')
            .description('|Get user info of earlier configured user.|GET:/auth/me')
            .action(getAuthUserInfo);
    }
};
