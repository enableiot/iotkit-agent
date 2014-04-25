/**
 * Created by ammarch on 4/24/14.
 */
"use strict";
var fs = require('fs'),
    logger = require("./logger").init();
/**
 * @description it will write to JSON file overwriting the current content
 * @param filename <string> the name with path where the file will be wrote.
 * @param data <object> the will be wrote to filename
 */
module.exports.writeToJson = function (filename, data) {
    fs.writeFile(filename, JSON.stringify(data, null, 4), function(err) {
        if(err) {
            logger.error("The filename could not be write ", err);
        } else {
            logger.log("Object Data saved to " + filename);
        }
    });
};
/**
 * @description it will read from filename and return the content if not exists will return empty object
 * @param filename <string> fullpath name
 * @return <object> if the file not exist will return an empty object
 */
module.exports.readFileToJson = function (filename) {
    var objectFile = null;
    if (fs.existsSync(filename)) {
        try {
            objectFile = fs.readFileSync(filename);
            objectFile = JSON.parse(objectFile);
        } catch(err){
            logger.error("Improper JSON format :", err.message);
            logger.error(err.stack);
        }
    }
    logger.info("Filename ", filename, " read ", objectFile);
    return objectFile;
};

/**
 * @description filter and array using the condition parameter
 * @param array
 * @param condition
 * @returns {Array}
 */
module.exports.filterBy = function (array, condition) {
    var results = [ ] ;
    for ( var i = 0; i < array.length; i++) {
        var elem = array[i];
        if (condition(elem)=== true) {
            results.push( elem );
        }
    }
    return results ;
};
/**
 *
 * @param array
 * @param condition
 * @returns {{}}
 */
module.exports.firstOf = function (array, condition) {
    var results = null ;
    for ( var i = 0; i < array.length; i++) {
        var elem = array[i];
        if (condition(elem, i) === true) {
            results = elem ;
            break;
        }
    }
    return results ;
};
/**
 *
 * @param array
 * @param condition
 * @returns {number}
 */
module.exports.getIndexOf = function (array, condition) {
    var index = -1 ;
    exports.firstOf(array, function (obj, idx) {
                if (condition(obj) === true) {
                    index = idx;
                    return true;
                }
                return false;
            });
    return index;
};

module.exports.init = function (logT) {
    logger = logT;
};

module.exports.timeStamp = function () {
     return new Date().getTime();
};