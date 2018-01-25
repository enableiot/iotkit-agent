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

function GetListOfAlertsOption(data) {
    this.pathname = common.buildPath(apiconf.path.alerts.getListOfAlerts, data.accountId);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = GET_METHOD;
    this.body = null;
}
GetListOfAlertsOption.prototype = new ConnectionOptions();
GetListOfAlertsOption.prototype.constructor = GetListOfAlertsOption;
IoTKiT.GetListOfAlertsOption = GetListOfAlertsOption;


function DeleteListOfAlertsOption(data) {
    this.pathname = common.buildPath(apiconf.path.alerts.deleteListOfAlerts, data.accountId);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = DELETE_METHOD;
    this.body = null;
}
DeleteListOfAlertsOption.prototype = new ConnectionOptions();
DeleteListOfAlertsOption.prototype.constructor = DeleteListOfAlertsOption;
IoTKiT.DeleteListOfAlertsOption = DeleteListOfAlertsOption;

function GetAlertDetailsOption(data) {
    this.pathname = common.buildPath(apiconf.path.alerts.getAlertDetails, [data.accountId, data.alertId]);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = GET_METHOD;
    this.body = null;
}
GetAlertDetailsOption.prototype = new ConnectionOptions();
GetAlertDetailsOption.prototype.constructor = GetAlertDetailsOption;
IoTKiT.GetAlertDetailsOption = GetAlertDetailsOption;

function DeleteAlertOption(data) {
    this.pathname = common.buildPath(apiconf.path.alerts.deleteAlert, [data.accountId, data.alertId]);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = DELETE_METHOD;
    this.body = null;
}
DeleteAlertOption.prototype = new ConnectionOptions();
DeleteAlertOption.prototype.constructor = DeleteAlertOption;
IoTKiT.DeleteAlertOption = DeleteAlertOption;

function CloseAlertOption(data) {
    this.pathname = common.buildPath(apiconf.path.alerts.closeAlert, [data.accountId, data.alertId]);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = PUT_METHOD;
    this.body = null;
}
CloseAlertOption.prototype = new ConnectionOptions();
CloseAlertOption.prototype.constructor = CloseAlertOption;
IoTKiT.CloseAlertOption = CloseAlertOption;

function UpdateAlertStatusOption(data) {
    this.pathname = common.buildPath(apiconf.path.alerts.updateAlertStatus, [data.accountId, data.alertId, data.statusName]);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = PUT_METHOD;
    this.body = null;
}
UpdateAlertStatusOption.prototype = new ConnectionOptions();
UpdateAlertStatusOption.prototype.constructor = UpdateAlertStatusOption;
IoTKiT.UpdateAlertStatusOption = UpdateAlertStatusOption;

function AddCommentsToAlertOption(data) {
    this.pathname = common.buildPath(apiconf.path.alerts.addCommentsToAlert, [data.accountId, data.alertId]);
    this.token = data.userToken;
    ConnectionOptions.call(this);
    this.method = POST_METHOD;
    this.body = JSON.stringify(data.body);
}
AddCommentsToAlertOption.prototype = new ConnectionOptions();
AddCommentsToAlertOption.prototype.constructor = AddCommentsToAlertOption;
IoTKiT.AddCommentsToAlertOption = AddCommentsToAlertOption;

module.exports = IoTKiT;