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
 *  @description Send an actuation command through API: POST:/v1/api/accounts/{accountId}/control
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the device which sends the data
 *  @param data.body the description of the command as described in the API spec
 */
module.exports.sendActuationCommand = function(data, callback) {
    var sendActuationCommandOpt = new adminDef.control.SendActuationCommandOption(data);
    return httpClient.httpRequest(sendActuationCommandOpt, callback);
};

/**
 *  @description Save a complex command through API: POST:/v1/api/accounts/{accountId}/control/commands/{commandName}
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the device which sends the data
 *  @param data.commandName name of the actuation command
 *  @param data.body the description of the command as described in the API spec
 */
module.exports.saveComplexCommand = function(data, callback) {
    var saveComplexCommandOp = new adminDef.control.SaveComplexCommandOption(data);
    return httpClient.httpRequest(saveComplexCommandOp, callback);
};

/**
 *  @description Get list of complex commands through API: GET:/v1/api/accounts/{accountId}/control/commands/
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the device which sends the data
 */
module.exports.getComplexCommands = function(data, callback) {
    var getComplexCommandsOp = new adminDef.control.GetComplexCommandsOption(data);
    return httpClient.httpRequest(getComplexCommandsOp, callback);
};

/**
 *  @description Get list of complex commands through API: DELETE:/v1/api/accounts/{accountId}/control/commands/{commandName}
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the device which sends the data
 */
module.exports.deleteComplexCommand = function(data, callback) {
    var deleteComplexCommandsOp = new adminDef.control.DeleteComplexCommandOption(data);
    return httpClient.httpRequest(deleteComplexCommandsOp, callback);
};


/**
 *  @description Update a complex command through API: PUT:/v1/api/accounts/{accountId}/control/commands/{commandName}
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the device which sends the data
 *  @param data.commandName name of the actuation command
 *  @param data.body the description of the command as described in the API spec
 */
module.exports.updateComplexCommand = function(data, callback) {
    var updateComplexCommandOp = new adminDef.control.UpdateComplexCommandOption(data);
    return httpClient.httpRequest(updateComplexCommandOp, callback);
};

/**
 *  @description Get list of actuations through API: GET:/v1/api/accounts/{accountId}/control/devices/{deviceId}
 *  @param data.userToken contains the access token
 *  @param data.accountId id of the device which sends the data
 *  @param data.deviceId the id of the device
 */

module.exports.pullActuations = function (data, callback) {
    var actuations = new adminDef.control.ActuationsOption(data);
    return httpClient.httpRequest(actuations, callback);
};
