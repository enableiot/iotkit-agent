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
var fs = require ('fs');

var backupDir = process.argv[2];

var oldConfigFile = backupDir + '/config.json';
var oldSensorFile = backupDir + '/sensor-list.json';
var oldTokenFile  = backupDir + '/token.json';

var dataDir = './data';

// Import old values
var oldconfig = require(oldConfigFile);
var oldsensors = require(oldSensorFile);
var oldtoken = require(oldTokenFile);

// Locate and find new config
var globalConfigFile = './config/global.json';
var global = require(globalConfigFile);

var configFile    = dataDir + '/device.json'
if (global['data_directory']) {
  configFile = global['data_directory'] + '/device.json';
}
var config = require(configFile);

// Migrate config settings
var configKeys = ['device_id', 'gateway_id', 'device_name', 'device_loc'];
function setValue(key, newconfig, oldconfig) {
  if (oldconfig[configKeys[key]]) {
	  newconfig[configKeys[key]] = oldconfig[configKeys[key]];
  }
  console.log(configKeys[key] + ": " + oldconfig[configKeys[key]]);
}

for (var key in configKeys) {
  setValue(key, config, oldconfig);
}

// Migrate sensor list
config['sensor_list'] = oldsensors;
console.log("Sensor list: " + oldsensors);
// migrate token
config['device_token'] = oldtoken['deviceToken'];
console.log("Token: " + oldtoken['deviceToken']);
config['account_id'] = oldtoken['accountId'];
console.log("Account Id: " + oldtoken['accountId']);

// Save new config
fs.writeFile(configFile, JSON.stringify(config, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + configFile);
    }
}); 


