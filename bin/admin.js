#!/usr/bin/env node

/*
Copyright (c) 2014, Intel Corporation

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.
    * Neither the name of Intel Corporation nor the names of its contributors
      may be used to endorse or promote products derived from this software
      without specific prior written permission.

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
var admin= require('../lib/commander'),
    pkgJson = require('../package.json'),
    auth = require('../admin/operational'),
    components = require('../admin/components'),
    configurator = require('../admin/configurator'),
    fs = require('fs'),
    path = require('path'),
    logger = require("../lib/logger").init();

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
    });
/*
/*
 * Add commando as option
 */
auth.addCommand(admin);
components.addCommand(admin);
configurator.addCommand(admin);

admin.command('*')
     .description('Error message for non valid command')
     .action(function(){
        console.log("\'" + admin.args[0] + "\'" +
            ' is not a valid command.');
    });
if(process.argv[2] === 'observation') {
    if(process.argv.length === 5) {
        if(process.argv[4][0] === '-') {
            var args = [];
            var unknown = [];
            for(var i = 2; i <= 4; i++) {
                args.push(process.argv[i]);
            }
            var parsed = {args: args, unknown: unknown};
            admin.rawArgs = process.argv;
            admin.args = args;
            var result = admin.parseArgs(admin.args, parsed.unknown);
        }
        else {
            admin.parse(process.argv);
        }
    }
    else {
        console.log("\'" + process.argv[2] + "\'" +
            ' should contains component_name value.');
        process.exit(1);
    }
}
else {
    admin.parse(process.argv);
}
/*
 * Run if the command were specified at parameter
 */
/*
 * Help and versions also as commands
 */
if (!admin.args.length || admin.args[0] === 'help') {
    admin.help();
}
admin.command('version')
    .description('output the version number')
    .action(admin.version(pkgJson.version));


