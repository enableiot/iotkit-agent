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
var mac = require("getmac"),
    os = require("os"),
    http = require("http"),
    admin = require('../api/rest').admin,
    pkgJson = require('../package.json'),
    config = require ('../config');
    
function IoTKitUtils(cfg){
    var me = this;
    me.config = cfg;
    me.did = cfg.device_id;
}
IoTKitUtils.prototype.getLocation = function () {
    //TODO Need to implement location gather info
    if (config.device_loc) {
        return config.device_loc;
    }
    return null;
};
IoTKitUtils.prototype.getAgentAttr = function () {
   return {
       "agent_version": pkgJson.version,
       "hardware_vendor": os.cpus()[0].model,
       "hardware_model": os.platform(),
       "Model Name": os.arch(),
       "Firmware Version": os.release()
   };
};
IoTKitUtils.prototype.externalInfo = function(cb) {
    var me = this;
    if (!cb) {
        throw "Callback required";
    }
    admin.getExternalInfo(function (err, data){
        if (!err) {
            data.ip_local = me.getIPs()[0];
            cb(data);
        } else {
            cb(null);
        }
    });
};
IoTKitUtils.prototype.getExternalInfo = function(cb) {
  var me = this;
    if (!cb) {
        throw "Callback required";
    }

    var options = {
        host: 'ipinfo.io',
        port: 80,
        method: 'GET'
    };
    http.request(options, function(res) {
        if (res.statusCode === 200) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                var data = JSON.parse(chunk);
                data.ip_local = me.getIPs()[0];
                cb(data);
            });
        } else {
          cb(null);
        }
    }).end();
};
IoTKitUtils.prototype.getDeviceId = function(cb) {
  var me = this;
  if (!cb) {
      throw "Callback required";
  }
  // if use explicit Id if one was defined in the configuration file
  // account for the different ways people could spell it ;)
  if (me.did) {
    cb(me.did);
    return;
  }
  
  mac.getMac(function(err, macAddress){
      var result = null;
      if (err) {
        //Unable to get MAC address
        result = os.hostname().toLowerCase();
      } else {
        result = macAddress.replace(/:/g, '-');
      }
      me.did = result;
      cb(result);
  });
};
IoTKitUtils.prototype.getIPs = function() {
  var addresses = [];
  var interfaces = os.networkInterfaces();
  for (var k in interfaces) {
      if (interfaces.hasOwnProperty(k)) {
          for (var k2 in interfaces[k]) {
              if (interfaces[k].hasOwnProperty(k2)) {
                  var address = interfaces[k][k2];
                  if (address.family === 'IPv4' && !address.internal) {
                      addresses.push(address.address);
                  }
              }
          }
      }
  }

  return addresses;
  
};

IoTKitUtils.prototype.getGatewayId = function(key, cb) {
    var me = this;
    if (!cb) {
        throw "Callback required";
    }

    if (me.config[key]) {
        cb(me.config[key]);
    } else {
        (me.getDeviceId(cb));
    }
};

exports.init = function() {
  var utils = new IoTKitUtils(config);
  return utils;
};  
