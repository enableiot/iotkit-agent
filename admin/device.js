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

var logger = require("../lib/logger").init(),
    utils = require("../lib/utils").init(),
    path = require('path'),
    common = require('../lib/common');

/*var filename = "config.json";*/

function showDeviceId () {
    utils.getDeviceId(function (id) {
        console.log(id);
    });
}

/*function saveDeviceId (device_id) {
    var fullFilename = path.join(__dirname, '../config/' +  filename);
    var data = common.readFileToJson(fullFilename);
    logger.info("The old device Id was : ", data.device_id);
    logger.info("The New device Id is : ", device_id);
    data.device_id = device_id;
    return common.writeToJson(fullFilename, data);
}*/


module.exports = {
    addCommand : function (program) {
        program.option('-d, --deviceid', 'show the device id');
      /*  program.option('-s, --setdeviceid <devideid>', 'override the device id');
        program.option('-D, --cleardeviceid', 'clear the device id override');*/
    },
    runCommand: function (program) {
        if (program.deviceid) {
            showDeviceId();
        } /*else if (program.setdeviceid) {
            logger.info("Deviceid will override by : ", program.setdeviceid);
            saveDeviceId(program.setdeviceid);
        } else if (program.cleardeviceid) {
            logger.info("Clearing the Device ID  override");
            saveDeviceId(false);
        }
        if (program.initialize) {
            saveDeviceId(false);
        }*/
    }
};