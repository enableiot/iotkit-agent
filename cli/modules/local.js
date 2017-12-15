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

var userAdminData = require("../lib/cli-data");


var getLocalAccounts = function() {
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    if (userAdminDataObj.accounts) {
        userAdminDataObj.accounts.forEach(function(i) {
            console.log(i.id, i.name);
        });
    }
    
};


var getUserId = function() {
    var userAdminDataObj = userAdminData.loadUserAdminBaseData();
    if (userAdminDataObj.userId) {
        console.log(userAdminDataObj.userId);
    }
    
};




module.exports = {
    addCommand : function (program) {
        program
            .command('local.accounts')
            .description('|Get list of accounts from local config. Useful for shell processing.| N/A only local processing')
            .action(getLocalAccounts);
        program
            .command('local.userId')
            .description('|Get userId. Useful for shell processing.| N/A only local processing')
            .action(getUserId);
    }
};
