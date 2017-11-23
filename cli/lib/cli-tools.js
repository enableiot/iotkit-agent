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


module.exports = {


    /* @brief find account id based on pattern
     * @description account id can be given as
     * * "account@i" which selects the ith element of the accounts in the data file
     * * "pattern" which selects the first matching account name or id 
     * * "string"    which selects the first matching exact name or account id
     * @param accountId pattern or string as described above
     * @param accounts  account array from user_admin_data
     */
    findAccountId: function(accountId, accounts) {
        if ( typeof accounts === 'undefined') {
            return null;
        }
        var iPattern = new RegExp("account@([0-9]+)$");
        var iFound = accountId.match(iPattern);
        if (iFound && iFound[1]) {
            if (typeof accounts[iFound[1]] === 'undefined') {
                return null;
            } else {
                return {"id": accounts[iFound[1]].id, "index": iFound[1]};
            }
        }
        var restPattern = new RegExp(accountId);
        var restIndex = accounts.findIndex(function(i) {
            return restPattern.test(i.id) || restPattern.test(i.name);
        });
        if (restIndex >= 0) {
            return {"id": accounts[restIndex].id, "index": restIndex};
        }
        return null;
    },
    /* @brief find device id based on pattern
     * @description device id can be given as
     * * "device@i" which selects the ith element of the accounts in the data file
     * * "pattern" which selects the first matching account name or id 
     * * "string"    which selects the first matching exact name or account id
     * @param deviceId pattern or string as described above
     * @param account  account structure in user-admin-data
     */
    findDeviceId: function(deviceId, account) {
        if (typeof account.devices === 'undefined') {
            return null;
        }
        var iPattern = new RegExp("device@([0-9]+)$");
        var iFound = deviceId.match(iPattern);
        if (iFound && iFound[1]) {
            if (typeof account.devices[iFound[1]] === 'undefined') {
                return null;
            } else {
                return {"id": account.devices[iFound[1]].deviceId, "index": iFound[1]};
            }
        }
        var restPattern = new RegExp(deviceId);
        var restIndex = account.devices.findIndex(function(i) {
            return restPattern.test(i.deviceId) || restPattern.test(i.name);
        });
        if (restIndex >= 0) {
            return {"id": account.devices[restIndex].deviceId, "index": restIndex};
        }
        return null;
    },
    /* @brief find cid based on pattern
     * @description account id can be given as
     * * "cid@i" which selects the ith element of the accounts in the data file
     * * "pattern" which selects the first matching account name or id 
     * * "string"    which selects the first matching exact name or account id
     * @param cid pattern or string as described above
     * @param devices devices structure in user-admin-data
     */
    findCid: function(cid, device) {
        if (typeof device.components === 'undefined') {
            return null;
        }
        var iPattern = new RegExp("cid@([0-9]+)$");
        var iFound = cid.match(iPattern);
        if (iFound && iFound[1]) {
            if (typeof device.components[iFound[1]] === 'undefined') {
                return null;
            } else {
                return {"id": device.components[iFound[1]].cid, "index": iFound[1]};
            }
        }
        var restPattern = new RegExp(cid);
        var restIndex = device.components.findIndex(function(i) {
            return restPattern.test(i.cid) || restPattern.test(i.name);
        });
        if (restIndex >= 0) {
            return {"id": device.components[restIndex].cid, "index": restIndex};
        }
        return null;
    },
    /* @briefly check alerts status' name is valiid or not
     * @description when update alert status, we should check status is valid or not
     * @param statusName statusName should be one of ['New', 'Open', 'Closed']
     */
    isValidStatusName: function(statusName) {
        if(("New" === statusName)||("Open" === statusName)||("Closed" === statusName)) {
            return true;
        } else {
            return false;
        }
    },
    /* @brief find alert id based on pattern
     * @description alert id can be given as
     * * "alert@i" which selects the ith element of the accounts in the data file
     * * "pattern" which selects the first matching account name or id 
     * * "string"    which selects the first matching exact name or account id
     * @param alertId pattern or string as described above
     * @param account  account structure in user-admin-data
     */
    findAlertId: function(alertId, account) {
        if (typeof account.alerts === 'undefined') {
            return null;
        }
        var iPattern = new RegExp("alert@([0-9]+)$");
        var iFound = alertId.match(iPattern);
        if (iFound && iFound[1]) {
            if (typeof account.alerts[iFound[1]] === 'undefined') {
                return null;
            } else {
                return {"id": account.alerts[iFound[1]].deviceId, "index": iFound[1]};
            }
        }
        var restPattern = new RegExp(alertId);
        var restIndex = account.alerts.findIndex(function(i) {
            return restPattern.test(i.alertId);
        });
        if (restIndex >= 0) {
            return {"id": account.alerts[restIndex].alertId, "index": restIndex};
        }
        return null;
    },
};
