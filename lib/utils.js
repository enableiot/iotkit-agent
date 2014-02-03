var mac = require("getmac"),
    fs = require("fs");
    path = require("path");
    os = require("os");
    
function IoTKitUtils(){
  var me = this;
  me.devicePerfix = "d-";
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
      cb(me.devicePerfix + result);
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
