/*
Copyright (c) 2012, Intel Corporation

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

var mac = require("getmac"),
    fs = require("fs");
    path = require("path");
    os = require("os");
    
function IoTKitUtils(){
  var me = this;
};

IoTKitUtils.prototype.getTimeStamp = function() {
  return new Date().getTime();
};

IoTKitUtils.prototype.getConfig = function() {
  var me = this;
  var conf = {};
  var confPath=path.join(__dirname, '../config.json');
  if (fs.existsSync(confPath)) { 
    try {
      conf = require(confPath);
    } catch (ex){
      //Configuration error. Using defaults
    }
  }else{
    //Configuration: defaults
  }
  return conf;
};

IoTKitUtils.prototype.getDeviceId = function(cb) {
  var me = this;
  if (!cb) throw "Callback required";
  
  mac.getMac(function(err, macAddress){
      var result = null;
      if (err){
        //Unable to get MAC address
        result = os.hostname().toLowerCase();
      }else{
        result = macAddress.replace(/:/g, '-');; 
      }
      cb(result);
  });
};

IoTKitUtils.prototype.getIPs = function() {
  var me = this;

  var addresses = [];
  var interfaces = os.networkInterfaces();
  for (k in interfaces) {
      for (k2 in interfaces[k]) {
          var address = interfaces[k][k2];
          if (address.family == 'IPv4' && !address.internal) {
              addresses.push(address.address)
          }
      }
  }

  return addresses;
  
};


exports.init = function(config) {
  return new IoTKitUtils(config);
};  
