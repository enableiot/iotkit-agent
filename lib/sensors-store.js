var fs = require('fs');
var path = require("path");
var sensorPath = path.join(__dirname, '../sensors-list.json');
var logger;

//Async method
var saveSensorsList = function (sensorsList){
    var sensorsListJson=JSON.stringify(sensorsList);

    fs.writeFile(sensorPath, sensorsListJson, function (err) {
        if(err) logger.error('Error writing sensors file: %s', err);
    });

};

//Sync method
var getSensorsList = function(){
	try{
	    var sensorsListJSON= fs.readFileSync(sensorPath);
	    return JSON.parse(sensorsListJSON);
	}catch(err){
		return {};
	}
};

var init = function(loggerObj) {
    logger = loggerObj;
}

module.exports.init = init;
module.exports.saveSensorsList = saveSensorsList;
module.exports.getSensorsList = getSensorsList;