var fs = require('fs');
var path = require("path");
var sensorPath=path.join(__dirname, '../sensorList.json');

//Async method
var saveSensorList = function (sensorList){
    var sensorListJson=JSON.stringify(sensorList);


    fs.writeFile(sensorPath, sensorListJson, function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
    });

};

//Sync method
var getSensorList = function(){
    var sensorListJSON= fs.readFileSync(sensorPath);
    return JSON.parse(sensorListJSON);
};

module.exports.saveSensorList = saveSensorList;
module.exports.getSensorList = getSensorList;
