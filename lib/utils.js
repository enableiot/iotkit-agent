var mac = require("getmac"),
    os = require("os");
    
function IoTKitUtils(logger){
  var me = this;
  me.logger = logger;
  me.devicePerfix = "d-";
};

IoTKitUtils.prototype.getDeviceId = function(cb) {
  var me = this;
  if (!cb) throw "Callback required";
  
  mac.getMac(function(err, macAddress){
      var result = null;
      if (err){
        me.logger.error('Unable to get MAC address', err);
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


exports.init = function(config, logger) {
  return new IoTKitUtils(config, logger);
};  
