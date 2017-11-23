/*
Copyright (c) 2014, Intel Corporation

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

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
    config = require("oisp-sdk-js").config,
    logger = require("oisp-sdk-js").lib.logger.init();

/*
 * @description error messages of cli-tool
 */
module.exports.errors = {
    "ok":             {"code": 0, "message": "OK"},
    "responseError":  {"code": 1, "message": "Server Response Error"},
    "parseJsonError": {"code": 2, "message": "Can't parse JSON"},
    "accountIdError": {"code": 3, "message": "Account ID not found in local file"},
    "deviceIdError":  {"code": 4, "message": "Device ID not found in local file"},
    "cidError":       {"code": 5, "message": "Component ID not found in local file"},
    "fsError":        {"code": 6, "message": "Filesystem error"},
    "alertIdError":   {"code": 7, "message": "Alert Id not found in local file"},
    "staNameError":   {"code": 8, "message": "Alert Status name is Error"},
    "usernameError":  {"code": 9, "message": "user name not found in local file"}
};

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
        } catch(err) {
            objectFile = null;
            logger.error("Improper JSON format :", err.message);
            logger.error(err.stack);
        }
    }
    logger.debug("Filename ", filename, " read ", objectFile);
    return objectFile;
};

module.exports.initializeFile = function(filepath, data) {
    if(!fs.existsSync(filepath)) {
        if (!fs.existsSync(path.dirname(filepath))) {
            fs.mkdirSync(path.dirname(filepath));
        }
        this.writeToJson(filepath, data);
    }
};

module.exports.init = function (logT) {
    logger = logT;
};


module.exports.isAbsolutePath = function(location) {
    return path.resolve(location) === path.normalize(location);
};

module.exports.getFileFromDataDirectory = function(filename) {
    var fullFileName = '';
    if(config) {
        var dataDirectory = config['data_directory'];
        if (module.exports.isAbsolutePath(dataDirectory)) {
            fullFileName = path.resolve(dataDirectory, filename);
        } else {
            fullFileName = path.resolve(__dirname, "..", dataDirectory, filename);
        }
    }
    return fullFileName;
};

module.exports.getDeviceConfigName = function() {
    var fullFileName = module.exports.getFileFromDataDirectory('device.json');
    if (fs.existsSync(fullFileName)) {
        return fullFileName;
    } else {
        var defaultConfig = path.resolve(__dirname, "../data/device.json");
        if(!fs.existsSync(fullFileName) && fs.existsSync(defaultConfig)) {
            return defaultConfig;
        } else{
            logger.error("Failed to find device config file");
            throw new Error("Failed to find device config file");
        }
    }
};

module.exports.getDeviceConfig = function() {
    var config = this.readFileToJson(this.getDeviceConfigName());
    return config;
};

module.exports.getConfig = function() {
    if(process.userConfigPath) {
        return require(process.userConfigPath);
    }else{
        return config;
    }
};


module.exports.readConfig = function(fileName) {
    return this.readFileToJson(fileName);
};


module.exports.writeConfig = function(fileName, data) {
    this.writeToJson(fileName, data);
};

module.exports.saveToGlobalConfig = function(key, value) {
    var fileName = path.resolve(__dirname, '../config/global.json');
    this.saveToConfig(fileName, key, value);
};


module.exports.saveToDeviceConfig = function(key, value) {
    var fileName = this.getDeviceConfigName();
    this.saveToConfig(fileName, key, value);
};

module.exports.saveToConfig = function() {
    if (arguments.length < 2) {
        logger.error("Not enough arguments : ", arguments);
        throw new Error("Not enough arguments for saveToConfig");
    }

    var fileName = arguments[0];
    var key = arguments[1];
    var value = arguments[2];
    var data = this.readConfig(fileName);
    var keys = key.split('.');
    var configSaver = function (data, keys) {
        while(keys.length > 1) {
            var subtree = {};
            subtree[keys.pop()] = value;
            value = subtree;
        }
        try{
            data[keys.pop()] = value;
        } catch(err) {
            throw new Error("Could not add value to config file:", err);
        }
        return data;
    };
    data = configSaver(data, keys);
    this.writeConfig(fileName, data);
    return true;
};
