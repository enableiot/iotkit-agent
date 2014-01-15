var mac = require("getmac"),
    fs = require("fs");
    path = require("path");
    os = require("os");
    
function IoTKitUtils(logger){
  var me = this;
  me.logger = logger;
  me.devicePerfix = "d-";
};

IoTKitUtils.prototype.getConfig = function() {
  var me = this;
  var conf = {};
  var confPath=path.join(__dirname, '../config.json');
  if (fs.existsSync(confPath)) { 
    me.logger.info("Configuration:", confPath);
    try {
      conf = require(confPath);
    } catch (ex){
      me.logger.error("Configuration error. Using defaults");
    }
  }else{
    me.logger.info("Configuration: defaults");
  }
  return conf;
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
