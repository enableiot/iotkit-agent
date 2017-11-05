#!/usr/bin/env node

/*
Copyright (c) 2016, Intel Corporation

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
var admin= require('commander'),
    pkgJson = require('../package.json'),
    auth = require('../modules/auth'),
    accounts = require('../modules/accounts'),
    users = require('../modules/users'),
    data = require('../modules/data'),
    devices = require('../modules/devices'),
    local = require('../modules/local'),
    fs = require('fs'),
    path = require('path'),
    logger = require("oisp-sdk-js").lib.logger.init();


var helpBase = function(apiBase){
    if ( ! apiBase.match(new RegExp("^regular$|^all$|^apionly$|^auth$|^users$|^accounts$|^rules$|^alerts$|^devices$|^data$|^components$|^control$|^invites$"))){
	console.log("Unknown apiBase command");
	return;
    }
    var processHelp = function(txt){
	var split_txt = txt.split('\n');
	var result = "";
	var replace_pattern = new RegExp("^(.*)\\|(.*)\\|(.*)$");
	var apiBase_pattern = new RegExp("^ *" + apiBase);

	split_txt.forEach(function(line){
	    if (apiBase === "regular"){
		line = line.replace(replace_pattern, "$1$2");
	    }
	    else if (apiBase === "apionly"){
		line = line.replace(replace_pattern, "$1API: $3");
	    }
	    else if (apiBase === "all"){
		line = line.replace(replace_pattern, "$1$2 API: $3");
	    }
	    else { /* try to filter for apiBase*/
		if (line.match(apiBase_pattern)){
		    line = line.replace(replace_pattern, "$1$2 API: $3");
		}
		else {
		    line = "";
		}
	    }
	    if (line !== "") {
		result += line + "\n";
	    }
	});
	return result;
    };

    admin.outputHelp(processHelp);
};

admin.version(pkgJson.version)
    .option('-C, --config [path]', "Set the config file path", function(userConfDirectory){
        process.userConfigPath = path.resolve(userConfDirectory , "user.js");
        if (fs.existsSync(process.userConfigPath)) {
            logger.info("\'" + process.userConfigPath + "\'" +
                ' will be used as user config file.');
        }
        else{
            logger.error("\'" + process.userConfigPath + "\'" +
                ' not contains user.js config file.');
            process.exit(1);
        }
    })
    .command("help <apiBase>")
    .description("Filters help text by API base path, [all, apionly, auth, users, accounts, rules, alerts, devices, data, components, control, invites]")
    .action(helpBase);

/* Error handling */
var errorHandler = function(error, code){
    if (error) {
	console.error(error);
    }
    process.exit(code);
};


/*
 * Add commando as option
 */
auth.addCommand(admin, errorHandler);
users.addCommand(admin, errorHandler);
accounts.addCommand(admin, errorHandler);
devices.addCommand(admin, errorHandler);
data.addCommand(admin, errorHandler);
local.addCommand(admin, errorHandler);

admin.command('*')
     .description('Error message for non valid command')
     .action(function(){
        console.log("\'" + admin.args[0] + "\'" +
            ' is not a valid command.');
    });


admin.parse(process.argv);


/*
 * Run if the command were specified at parameter
 */
/*
 * Help and versions also as commands
 */


if (!admin.args.length || admin.args[0] === 'help') {
    helpBase("regular");
}
admin.command('version')
    .description('output the version number')
    .action(admin.version(pkgJson.version));


