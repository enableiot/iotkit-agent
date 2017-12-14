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
var config = require('../../config');
var common = require('../../lib/common');

var ConnectionOptions = require('./iot.connection.def.js');

var GET_METHOD = 'GET';
var PUT_METHOD = 'PUT';
var POST_METHOD = 'POST';
var DELETE_METHOD = 'DELETE';

var apiconf = config.connector.rest;

//variable to be returned
var IoTKiT = {};


function CreateAccountOption(data) {
    this.pathname = common.buildPath(apiconf.path.accounts.create);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = POST_METHOD;
    this.body = JSON.stringify(data.body);
}
CreateAccountOption.prototype = new ConnectionOptions();
CreateAccountOption.prototype.constructor = CreateAccountOption;
IoTKiT.CreateAccountOption = CreateAccountOption;


function GetAccountInfoOption(data) {
    this.pathname = common.buildPath(apiconf.path.accounts.accountId, data.accountId);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = GET_METHOD;
    this.body = null;
}
GetAccountInfoOption.prototype = new ConnectionOptions();
GetAccountInfoOption.prototype.constructor = GetAccountInfoOption;
IoTKiT.GetAccountInfoOption = GetAccountInfoOption;


function UpdateAccountOption(data) {
    this.pathname = common.buildPath(apiconf.path.accounts.accountId, data.accountId);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = PUT_METHOD;
    this.body = JSON.stringify(data.body);
}
UpdateAccountOption.prototype = new ConnectionOptions();
UpdateAccountOption.prototype.constructor = UpdateAccountOption;
IoTKiT.UpdateAccountOption = UpdateAccountOption;


function DeleteAccountOption(data) {
    this.pathname = common.buildPath(apiconf.path.accounts.accountId, data.accountId);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = DELETE_METHOD;
    this.body = null;
}
DeleteAccountOption.prototype = new ConnectionOptions();
DeleteAccountOption.prototype.constructor = DeleteAccountOption;
IoTKiT.DeleteAccountOption = DeleteAccountOption;


function GetAccountActivationCodeOption(data) {
    this.pathname = common.buildPath(apiconf.path.accounts.activationcode, data.accountId);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = GET_METHOD;
    this.body = null;
}
GetAccountActivationCodeOption.prototype = new ConnectionOptions();
GetAccountActivationCodeOption.prototype.constructor = GetAccountActivationCodeOption;
IoTKiT.GetAccountActivationCodeOption = GetAccountActivationCodeOption;


function RefreshAccountActivationCodeOption(data) {
    this.pathname = common.buildPath(apiconf.path.accounts.refresh, data.accountId);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = PUT_METHOD;
    this.body = null;
}
RefreshAccountActivationCodeOption.prototype = new ConnectionOptions();
RefreshAccountActivationCodeOption.prototype.constructor = RefreshAccountActivationCodeOption;
IoTKiT.RefreshAccountActivationCodeOption = RefreshAccountActivationCodeOption;


function ChangeAccountUserOption(data) {
    this.pathname = common.buildPath(apiconf.path.accounts.userid, [data.accountId, data.userId]);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = PUT_METHOD;
    this.body = JSON.stringify(data.body);
}
ChangeAccountUserOption.prototype = new ConnectionOptions();
ChangeAccountUserOption.prototype.constructor = ChangeAccountUserOption;
IoTKiT.ChangeAccountUserOption = ChangeAccountUserOption;


function GetAccountUsersOption(data) {
    this.pathname = common.buildPath(apiconf.path.accounts.users, data.accountId);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = GET_METHOD;
    this.body = null;
}
GetAccountUsersOption.prototype = new ConnectionOptions();
GetAccountUsersOption.prototype.constructor = GetAccountUsersOption;
IoTKiT.GetAccountUsersOption = GetAccountUsersOption;


module.exports = IoTKiT;
