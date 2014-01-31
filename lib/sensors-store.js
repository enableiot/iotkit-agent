var fs = require('fs');
var path = require("path");
var sensorPath = path.join(__dirname, '../sensor-list.json');

//Async method
var saveSensorList = function (sensorList, callback){
    var sensorListJson = JSON.stringify(sensorList);

    fs.writeFile(sensorPath, sensorListJson, function (err) {
        if (err) callback(err);
        else callback(null, "saved");
    });

};

//Sync method
var getSensorList = function(){
    var sensorListJSON = fs.readFileSync(sensorPath);
    return JSON.parse(sensorListJSON);
};

module.exports.saveSensorList = saveSensorList;
module.exports.getSensorList = getSensorList;
