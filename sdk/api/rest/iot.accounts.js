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

"use strict";


var httpClient = require('../../lib/httpClient');
var userAdminDef = require('./admin.def');


/** @description create Account through API: POST:/v1/api/accounts
 *  @param data.body contains account data, see API spec
 */
module.exports.createAccount = function(data, callback) {
    var createAccountOpt = new userAdminDef.accounts.CreateAccountOption(data);
    return httpClient.httpRequest(createAccountOpt, callback);
};


/** @description get account  info through API: GET:/v1/api/accounts/{accountId}
 *  @param data.token contains the access token
 *  @param data.accountId contains the accountid of the target account
 */
module.exports.getAccountInfo = function(data, callback) {
    var getAccountInfoOpt = new userAdminDef.accounts.GetAccountInfoOption(data);
    return httpClient.httpRequest(getAccountInfoOpt, callback);
};


/** @description update account through API:DELETE/v1/api/accounts/{accountId}
 *  @param data.userToken contains access token
 *  @param data.account contains the account d to be updated
 */
module.exports.updateAccount = function(data, callback) {
    var updateAccountOpt = new userAdminDef.accounts.UpdateAccountOption(data);
    return httpClient.httpRequest(updateAccountOpt, callback);
};


/** @description delete account through API: DELETE:/v1/api/accounts/{accountId}
 *  @param data.accountId account to delete
 *  @param data.userToken contains access token
 */
module.exports.deleteAccount = function(data, callback) {
    var deleteAccountOpt = new userAdminDef.accounts.DeleteAccountOption(data);
    return httpClient.httpRequest(deleteAccountOpt, callback);
};


/** @description Get account activation code for devices API: Get:/v1/api/accounts/{accountId}/activationcode
 *  @param data.body.token contains the token received from POST call above through email
 *  @param data.accountId id of account
 */
module.exports.getAccountActivationCode = function(data, callback) {
    var getAccountActivationCodeOpt = new userAdminDef.accounts.GetAccountActivationCodeOption(data);
    return httpClient.httpRequest(getAccountActivationCodeOpt, callback);
};


/** @description refresh activation code API: PUT:/v1/api/accounts/{accountId}/activationcode/refresh
 *  @param data.userToken contains access token
 */
module.exports.refreshAccountActivationCode = function(data, callback) {
    var refreshAccountActivationCodeOpt = new userAdminDef.accounts.RefreshAccountActivationCodeOption(data);
    return httpClient.httpRequest(refreshAccountActivationCodeOpt, callback);
};


/** @description change user rights for an account through API: PUT:/v1/api/accounts/{accountId}/users/{userId}
 *  @param data.userToken access token
 *  @param data.accountId account for which the user is changed
 *  @param data.userId id of user
 *  @param data.body contains details of changes, see API documentation
 */
module.exports.changeAccountUser = function(data, callback) {
    var changeAccountUserOpt = new userAdminDef.accounts.ChangeAccountUserOption(data);
    return httpClient.httpRequest(changeAccountUserOpt, callback);
};


/** @description get all users of an account through API: GET:/v1/api/accounts/{accountId}/users
 *  @param data.userToken access token
 *  @param data.accountId account for which the user is changed
 */
module.exports.getAccountUsers = function(data, callback) {
    var getAccountUsersOpt = new userAdminDef.accounts.GetAccountUsersOption(data);
    return httpClient.httpRequest(getAccountUsersOpt, callback);
};
