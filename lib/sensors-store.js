/*
Copyright (c) 2013, Intel Corporation

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

var fs = require('fs');
var path = require("path");
var sensorPath = path.join(process.env.HOME, '/.sensors-list.json');
var logger;

// async method
var saveSensorsList = function(sensorsList){
    var sensorsListJson = JSON.stringify(sensorsList);
    fs.writeFileSync(sensorPath, sensorsListJson);
};

// sync method
var getSensorsList = function(){
  var defaultDoc = {};
  if (!fs.existsSync(sensorPath)){
    saveSensorsList(defaultDoc);
  }
	try{
	    var sensorsListJSON = fs.readFileSync(sensorPath);
	    return JSON.parse(sensorsListJSON);
	}catch(err){
  		logger.error("UncaughtException:", err.message);
  		logger.error(err.stack);
		return defaultDoc;
	}
};

var init = function(loggerObj) {
    logger = loggerObj;
}

module.exports.init = init;
module.exports.saveSensorsList = saveSensorsList;
module.exports.getSensorsList = getSensorsList;