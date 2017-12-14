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


function GetUserInfoOption(data) {
    this.pathname = common.buildPath(apiconf.path.user.userId, data.userId);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = GET_METHOD;
    this.body = null;
}
GetUserInfoOption.prototype = new ConnectionOptions();
GetUserInfoOption.prototype.constructor = GetUserInfoOption;
IoTKiT.GetUserInfoOption = GetUserInfoOption;


function UpdateUserInfoOption(data) {
    this.pathname = common.buildPath(apiconf.path.user.userId, data.userId);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = PUT_METHOD;
    this.body = JSON.stringify(data.body);
}
UpdateUserInfoOption.prototype = new ConnectionOptions();
UpdateUserInfoOption.prototype.contstructor = UpdateUserInfoOption;
IoTKiT.UpdateUserInfoOption = UpdateUserInfoOption;


function DeleteUserOption(data) {
    this.pathname = common.buildPath(apiconf.path.user.userId, data.deleteUserId);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = DELETE_METHOD;
    this.body = null;
}
DeleteUserOption.prototype = new ConnectionOptions();
DeleteUserOption.prototype.contstructor = DeleteUserOption;
IoTKiT.DeleteUserOption = DeleteUserOption;


function RequestUserPasswordChangeOption(data) {
    this.pathname = common.buildPath(apiconf.path.user.forgotPassword);
    ConnectionOptions.call(this);
    this.method = POST_METHOD;
    this.body = JSON.stringify(data.body);
}
RequestUserPasswordChangeOption.prototype = new ConnectionOptions();
RequestUserPasswordChangeOption.prototype.contstructor = RequestUserPasswordChangeOption;
IoTKiT.RequestUserPasswordChangeOption = RequestUserPasswordChangeOption;


function UpdateUserPasswordOption(data) {
    this.pathname = common.buildPath(apiconf.path.user.forgotPassword);
    ConnectionOptions.call(this);
    this.method = PUT_METHOD;
    this.body = JSON.stringify(data.body);
}
UpdateUserPasswordOption.prototype = new ConnectionOptions();
UpdateUserPasswordOption.prototype.contstructor = UpdateUserPasswordOption;
IoTKiT.UpdateUserPasswordOption = UpdateUserPasswordOption;


function ChangeUserPasswordOption(data) {
    this.pathname = common.buildPath(apiconf.path.user.changePassword, data.username);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = PUT_METHOD;
    this.body = JSON.stringify(data.body);
}
ChangeUserPasswordOption.prototype = new ConnectionOptions();
ChangeUserPasswordOption.prototype.contstructor = ChangeUserPasswordOption;
IoTKiT.ChangeUserPasswordOption = ChangeUserPasswordOption;


function RequestUserActivationOption(data) {
    this.pathname = common.buildPath(apiconf.path.user.requestUserActivation);
    ConnectionOptions.call(this);
    this.method = POST_METHOD;
    this.body = JSON.stringify(data.body);
}
RequestUserActivationOption.prototype = new ConnectionOptions();
RequestUserActivationOption.prototype.contstructor = RequestUserActivationOption;
IoTKiT.RequestUserActivationOption = RequestUserActivationOption;


function AddUserOption(data) {
    this.pathname = common.buildPath(apiconf.path.user.addUser);
    ConnectionOptions.call(this);
    this.method = POST_METHOD;
    this.body = JSON.stringify(data.body);
}
AddUserOption.prototype = new ConnectionOptions();
AddUserOption.prototype.contstructor = AddUserOption;
IoTKiT.AddUserOption = AddUserOption;


function ActivateUserOption(data) {
    this.pathname = common.buildPath(apiconf.path.user.activateUser);
    ConnectionOptions.call(this);
    this.method = POST_METHOD;
    this.body = JSON.stringify(data.body);
}
ActivateUserOption.prototype = new ConnectionOptions();
ActivateUserOption.prototype.contstructor = ActivateUserOption;
IoTKiT.ActivateUserOption = ActivateUserOption;


module.exports = IoTKiT;
