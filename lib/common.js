/*
Copyright (c) 2014, Intel Corporation

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.
    * Neither the name of Intel Corporation nor the names of its contributors
      may be used to endorse or promote products derived from this software
      without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

"use strict";
var fs = require('fs'),
    path = require('path'),
    logger = require("./logger").init();
/**
 * @description it will write to JSON file overwriting the current content
 * @param filename <string> the name with path where the file will be wrote.
 * @param data <object> the will be wrote to filename
 */
module.exports.writeToJson = function (filename, data) {
    var err = fs.writeFileSync(filename, JSON.stringify(data, null, 4));
    if(err) {
        logger.error("The file could not be written ", err);
        return true;
    } else {
        logger.log("Object data saved to " + filename);
        return false;
    }
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
    logger.debug("Filename ", filename, " read ", objectFile);
    return objectFile;
};

module.exports.initializeFile = function(filepath, data) {
    if(!fs.exists(filepath)) {
        this.writeToJson(filepath, data);
    }
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

module.exports.newTimeStamp = function () {
     return Math.round(new Date().getTime()); //13 Digits were required
};

/**
 * @description Build a path replacing patter {} by the data arguments
 * if more the one {} pattern is present it shall be use Array
 * @param path string the represent a URL path
 * @param data Array or string,
 * @returns {*}
 */
module.exports.buildPath = function (path, data) {
    var re = /{\w+}/;
    var pathReplace = path;
    if (Array.isArray(data)) {
        data.forEach(function (value) {
            pathReplace = pathReplace.replace(re, value);
        });
    } else {
        pathReplace = pathReplace.replace(re, data);
    }
    return pathReplace;
};


module.exports.getConfigName = function () {
    var filename = "global.json";
    var fullFileName = path.join(__dirname, '../config/' +  filename);

    if (fs.existsSync(fullFileName)) {
        return fullFileName;
    } else {
        console.error("Failed to find config file");
        return null;
    }
};

module.exports.getDeviceConfigName = function() {
    var filename = "device.json";
    var config = this.getConfig();

    var fullFileName = "";
    if(config.data_directory !== ''){
        fullFileName = path.join(config.data_directory +  filename);
    }
    else {
        fullFileName = path.join(__dirname, '../data/' +  filename);
    }

    if (fs.existsSync(fullFileName)) {
        return fullFileName;
    } else {
        console.error("Failed to find config file");
        return null;
    }
};

module.exports.getDeviceConfig = function(){
    var config = this.readFileToJson(this.getDeviceConfigName());
    return config;
};

module.exports.getConfig = function(){
    var userConfig = (process.userConfigPath) ? process.userConfigPath : path.join(__dirname, "../data/user.js");
    if(fs.existsSync(userConfig)){
        return require(userConfig);
    }
    else{
        return this.readConfig(path.join(__dirname,"../config/global.json"));
    }
};

module.exports.readConfig = function(fileName){
 return this.readFileToJson(fileName);
};

module.exports.writeConfig = function(fileName, data){
    this.writeToJson(fileName, data);
};

module.exports.saveToGlobalConfig = function(key, value){
    var fileName = this.getConfigName();
    this.saveToConfig(fileName, key,value);
};

module.exports.saveToUserConfig = function(key, value){
    var config = this.getConfig();
    if(config) {
        var userConfig = (process.userConfigPath) ? process.userConfigPath : "../data/user.js";
        var file = fs.readFileSync(path.join(__dirname, userConfig, 'utf8'));
        if (file.indexOf(key) > 0) {
            var filter = new RegExp("config." + key + ".*;");
            var newFile = file.replace(filter, "config." + key + "=\"" + value + "\";");
            fs.writeFileSync(path.join(__dirname, userConfig), newFile, 'utf8');
        }
        else {
            fs.appendFileSync(path.join(__dirname, userConfig), "config." + key + "=\"" + value + "\";\n");
        }
    }
};

module.exports.saveToDeviceConfig = function(key, value){
    var fileName = this.getDeviceConfigName();
    this.saveToConfig(fileName, key,value);
};

module.exports.saveToConfig = function(){
    if (arguments.length < 2) {
        logger.error("Not enough arguments : ", arguments);
        process.exit(1);
    }

    var fileName = arguments[0];
    var key = arguments[1];
    var value = arguments[2];
    var data = this.readConfig(fileName);
    var keys = key.split('.');
    var configSaver = function (data, keys) {
        var k = keys.splice(0, 1);
        if (data && (data[k[0]] !== undefined)) {
            logger.info("Config Key : ", k[0], " value ", value);
            if (keys.length > 0) {
                data[k[0]] = configSaver(data[k[0]], keys);
            } else {
                data[k[0]] = value;
                logger.debug("Config Key : ", data);
            }
            return data;
        } else {
            logger.error("Key : ", key, " not found");
            return false;
        }
    };
    data = configSaver(data, keys);
    if (data) {
        this.writeConfig(fileName, data);
    }
    return true;
};