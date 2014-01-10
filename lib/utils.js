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


exports.init = function(config, logger) {
  return new IoTKitUtils(config, logger);
};  
