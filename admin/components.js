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

var path = require('path'),
    Cloud = require("../api/cloud.proxy"),
    conf = require('../config'),
    utils = require("../lib/utils").init(),
    logger = require("../lib/logger").init(),
    common = require('../lib/common');

var filename = "sensor-list.json";
var resetComponents = function () {
    var fullFilename = path.join(__dirname, '../data/' +  filename);
    var data = [];
    return common.writeToJson(fullFilename, data);
};

function registerComponents (comp, cataloged) {
    utils.getDeviceId(function (id) {
        var cloud = Cloud.init(conf, logger, id);
        cloud.activate(code, function (err) {
            var r = 0;
            cloud.disconnect();
            if (!err) {
                var agentMessage = Message.init(cloud, logger);
                agentMessage.handler();

                logger.info("Device Activated ");

            } else {

                logger.error("Error in the activation process ...", err);
                r = 1;
            }
            process.exit(r)
        });
    });
}



module.exports.getComponentsList = function () {

};
module.exports.getCatalogList = function () {

};
function compList (val) {
    console.log("The arguments ", arguments);
}
module.exports = {

    addCommand : function (program) {
        program.option('-l, --register <comp_name> <cataloged>', 'display the components registered', compList);
        program.option('-L, --resetcomponents', 'clear the component lists');
        program.option('-n, --catalog', 'display the domain catalog');
    },

    runCommand: function (program) {
        if (program.register) {
            registerComponents(program.register, program.args)
        } else if (program.resetcomponents) {
            resetComponents();

        } else if (program.initialize) {
            resetComponents();

        }
    }
};