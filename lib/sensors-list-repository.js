var fs = require('fs');
var path = require("path");
var sensorPath=path.join(__dirname, '../sensors-list.json');

//Async method
var saveSensorsList = function (sensorsList){
    var sensorsListJson=JSON.stringify(sensorsList);

    fs.writeFile(sensorPath, sensorsListJson, function (err) {
        if (err) throw err;
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

module.exports.saveSensorsList = saveSensorsList;
module.exports.getSensorsList = getSensorsList;
