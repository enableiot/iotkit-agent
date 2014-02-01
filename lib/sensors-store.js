var fs = require('fs');
var path = require("path");
var sensorPath = path.join(__dirname, '../sensors-list.json');
var logger;

// async method
var saveSensorsList = function(sensorsList){
    var sensorsListJson = JSON.stringify(sensorsList);
    fs.writeFileSync(sensorPath, sensorsListJson);
};

// sync method
var getSensorsList = function(){
  if (!fs.existsSync(sensorPath)){
    saveSensorsList({});
  }
	try{
	    var sensorsListJSON = fs.readFileSync(sensorPath);
	    return JSON.parse(sensorsListJSON);
	}catch(err){
  		logger.error("UncaughtException:", err.message);
  		logger.error(err.stack);
		return {};
	}
};

var init = function(loggerObj) {
    logger = loggerObj;
}

module.exports.init = init;
module.exports.saveSensorsList = saveSensorsList;
module.exports.getSensorsList = getSensorsList;