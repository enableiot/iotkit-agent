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
var adminDef = require('./admin.def');

/**
 *  @description Create a rule through API: POST:/v1/api/accounts/{accountId}/rules
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the target account
 *  @param data.body the description of the rule as described in the API spec
 */
module.exports.createRule = function(data, callback) {
    var createRuleOpt = new adminDef.rules.CreateRuleOption(data);
    return httpClient.httpRequest(createRuleOpt, callback);
};

/**
 *  @description Delete a rule through API: DELETE:/v1/api/accounts/{accountId}/rules/delete_rule_with_alerts/{ruleId}
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the target account
 *  @param data.ruleId the id of the rule
 */
module.exports.deleteRule = function(data, callback) {
    var deleteRuleOpt = new adminDef.rules.DeleteRuleOption(data);
    return httpClient.httpRequest(deleteRuleOpt, callback);
};


/**
 *  @description Get list of rules through API: GET:/v1/api/accounts/{accountId}/rules
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the target account
 */
module.exports.getRules = function(data, callback) {
    var getRulesOpt = new adminDef.rules.GetRulesOption(data);
    return httpClient.httpRequest(getRulesOpt, callback);
};


/**
 *  @description Update a rule through API: PUT:/v1/api/accounts/{accountId}/rules/{ruleId}
 *  If rule doesn't exist it create a new one. Cannot be used for update of a draft rule.
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the target account
 *  @param data.ruleId the id of the rule
 *  @param data.body the description of the rule as described in the API spec
 */
module.exports.updateRule = function(data, callback) {
    var updateRuleOpt = new adminDef.rules.UpdateRuleOption(data);
    return httpClient.httpRequest(updateRuleOpt, callback);
};

/**
 *  @description Get details of a rule through API: GET:/v1/api/accounts/{accountId}/rules/{ruleId}
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the target account
 *  @param data.ruleId the id of the rule
 */
module.exports.getRuleDetails = function(data, callback) {
    var getRuleDetailsOpt = new adminDef.rules.GetRuleDetailsOption(data);
    return httpClient.httpRequest(getRuleDetailsOpt, callback);
};


/**
 *  @description Update the status of a rule through API: PUT /v1/api/accounts/{accountId}/rules/{ruleId}/status
 *  Cannot be used for changing the status of draft rule. Status value should be one of the following: ["Active", "Archived", "On-hold"]
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the target account
 *  @param data.ruleId the id of the rule
 *  @param data.body the description of the status as described in the API spec
 */
module.exports.updateRuleStatus = function(data, callback) {
    var updateRuleStatusOpt = new adminDef.rules.UpdateRuleStatusOption(data);
    return httpClient.httpRequest(updateRuleStatusOpt, callback);
};

/**
 *  @description Create a rule as draft through API: PUT:/v1/api/accounts/{accountId}/rules/draft
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the target account
 *  @param data.body the description of the rule as described in the API spec
 */
module.exports.createDraftRule = function(data, callback) {
    var createDraftRuleOpt = new adminDef.rules.CreateDraftRuleOption(data);
    return httpClient.httpRequest(createDraftRuleOpt, callback);
};

/**
 *  @description Delete a draft rule through API: DELETE: /v1/api/accounts/{accountId}/rules/draft/{ruleId}
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the target account
 *  @param data.ruleId the id of the rule
 */
module.exports.deleteDraftRule = function(data, callback) {
    var deleteDraftRuleOpt = new adminDef.rules.DeleteDraftRuleOption(data);
    return httpClient.httpRequest(deleteDraftRuleOpt, callback);
};


/**
 *  @description Clone a rule through API: POST: /v1/api/accounts/{accountId}/rules/clone/{ruleId}
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the target account
 *  @param data.ruleId the id of the rule
 */
module.exports.cloneRule = function(data, callback) {
    var cloneRuleOpt = new adminDef.rules.CloneRuleOption(data);
    return httpClient.httpRequest(cloneRuleOpt, callback);
};



