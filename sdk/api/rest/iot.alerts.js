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


/** @description get a list of all alerts for specified account through API:GET/v1/api/accounts/{accountId}/alerts
 *  @param data.userToken contains access token
 *  @param data.accountId contains the accountId
 */

module.exports.getListOfAlerts = function(data, callback) {
    var getListOfAlertsOpt = new userAdminDef.alerts.GetListOfAlertsOption(data);
    return httpClient.httpRequest(getListOfAlertsOpt, callback);
};

/** @description get specific alert details connected with the account through API:GET/v1/api/accounts/{accountId}/alerts/{alertId}
 *  @param data.userToken contains access token
 *  @param data.accountId contains the accountId
 *  @param data.alertId contains the alertId
 */

module.exports.getAlertDetails = function(data, callback) {
    var getAlertDetailsOpt = new userAdminDef.alerts.GetAlertDetailsOption(data);
    return httpClient.httpRequest(getAlertDetailsOpt, callback);
};

/** @description delete specific alert connected with the account through API:DELETE/v1/api/accounts/{accountId}/alerts/{alertId}
 *  @param data.userToken contains access token
 *  @param data.accountId contains the accountId
 *  @param data.alertId contains the alertId
 */

module.exports.deleteAlert = function(data, callback) {
    var deleteAlertOpt = new userAdminDef.alerts.DeleteAlertOption(data);
    return httpClient.httpRequest(deleteAlertOpt, callback);
};

/** @description Change alert status to - "Closed". Alert won't be active any more through API:PUT/v1/api/accounts/{accountId}/alerts/{alertId}/reset
 *  @param data.userToken contains access token
 *  @param data.accountId contains the accountId
 *  @param data.alertId contains the alertId
 */

module.exports.closeAlert = function(data, callback) {
    var closeAlertOpt = new userAdminDef.alerts.CloseAlertOption(data);
    return httpClient.httpRequest(closeAlertOpt, callback);
};

/** @description Change status of the Alert. Status should have one of the following values: ['New', 'Open', 'Closed'] through API:PUT/v1/api/accounts/{accountId}/alerts/{alertId}/status/{statusName}
 *  @param data.userToken contains access token
 *  @param data.accountId contains the accountId
 *  @param data.alertId contains the alertId
 *  @param data.statusName contains the statusName
 */

module.exports.updateAlertStatus = function(data, callback) {
    var updateAlertStatusOpt = new userAdminDef.alerts.UpdateAlertStatusOption(data);
    return httpClient.httpRequest(updateAlertStatusOpt, callback);
};

/** @description Add list of comments to the alert through API:POST/v1/api/accounts/{accountId}/alerts/{alertId}/comments
 *  @param data.userToken contains access token
 *  @param data.accountId contains the accountId
 *  @param data.alertId contains the alertId
 *  @param data.body contains the comments as described in the API spec
 */

module.exports.addCommentsToAlert = function(data, callback) {
    var addCommentsToAlertOpt = new userAdminDef.alerts.AddCommentsToAlertOption(data);
    return httpClient.httpRequest(addCommentsToAlertOpt, callback);
};