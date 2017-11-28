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


function CreateRuleOption(data) {
    this.pathname = common.buildPath(apiconf.path.rules.create, data.accountId);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = POST_METHOD;
    this.body = JSON.stringify(data.body);
}
CreateRuleOption.prototype = new ConnectionOptions();
CreateRuleOption.prototype.constructor = CreateRuleOption;
IoTKiT.CreateRuleOption = CreateRuleOption;

function DeleteRuleOption(data) {
    this.pathname = common.buildPath(apiconf.path.rules.delete, [data.accountId, data.ruleId]);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = DELETE_METHOD;
    this.body = JSON.stringify(data.body);
}
DeleteRuleOption.prototype = new ConnectionOptions();
DeleteRuleOption.prototype.constructor = DeleteRuleOption;
IoTKiT.DeleteRuleOption = DeleteRuleOption;


function GetRulesOption(data) {
    this.pathname = common.buildPath(apiconf.path.rules.getall, data.accountId);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = GET_METHOD;
    this.body = null;
}
GetRulesOption.prototype = new ConnectionOptions();
GetRulesOption.prototype.constructor = GetRulesOption;
IoTKiT.GetRulesOption = GetRulesOption;


function UpdateRuleOption(data) {
    this.pathname = common.buildPath(apiconf.path.rules.update, [data.accountId, data.ruleId]);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = PUT_METHOD;
    this.body = JSON.stringify(data.body);
}
UpdateRuleOption.prototype = new ConnectionOptions();
UpdateRuleOption.prototype.constructor = UpdateRuleOption;
IoTKiT.UpdateRuleOption = UpdateRuleOption;


function GetRuleDetailsOption(data) {
    this.pathname = common.buildPath(apiconf.path.rules.getdetails, [data.accountId, data.ruleId]);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = GET_METHOD;
    this.body = null;
}
GetRuleDetailsOption.prototype = new ConnectionOptions();
GetRuleDetailsOption.prototype.constructor = GetRuleDetailsOption;
IoTKiT.GetRuleDetailsOption = GetRuleDetailsOption;


function UpdateRuleStatusOption(data) {
    this.pathname = common.buildPath(apiconf.path.rules.update_status, [data.accountId, data.ruleId]);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = PUT_METHOD;
    this.body = JSON.stringify(data.body);
}
UpdateRuleStatusOption.prototype = new ConnectionOptions();
UpdateRuleStatusOption.prototype.constructor = UpdateRuleStatusOption;
IoTKiT.UpdateRuleStatusOption = UpdateRuleStatusOption;


function CreateDraftRuleOption(data) {
    this.pathname = common.buildPath(apiconf.path.rules.create_draft, data.accountId);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = PUT_METHOD;
    this.body = JSON.stringify(data.body);
}
CreateDraftRuleOption.prototype = new ConnectionOptions();
CreateDraftRuleOption.prototype.constructor = CreateDraftRuleOption;
IoTKiT.CreateDraftRuleOption = CreateDraftRuleOption;


function DeleteDraftRuleOption(data) {
    this.pathname = common.buildPath(apiconf.path.rules.delete_draft, [data.accountId, data.ruleId]);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = DELETE_METHOD;
    this.body = null
}
DeleteDraftRuleOption.prototype = new ConnectionOptions();
DeleteDraftRuleOption.prototype.constructor = DeleteDraftRuleOption;
IoTKiT.DeleteDraftRuleOption = DeleteDraftRuleOption;


function CloneRuleOption(data) {
    this.pathname = common.buildPath(apiconf.path.rules.clone, [data.accountId, data.ruleId]);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = POST_METHOD;
    this.body = null;
}
CloneRuleOption.prototype = new ConnectionOptions();
CloneRuleOption.prototype.constructor = CloneRuleOption;
IoTKiT.CloneRuleOption = CloneRuleOption;


module.exports = IoTKiT;
