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
    config = require("../config"),
    logger = require('./logger').init();
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
        logger.info("Object data saved to " + filename);
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
            logger.error("Improper JSON format:", err.message);
            logger.error(err.stack);
        }
    }
    logger.debug("Filename: " + filename + " Contents:", objectFile);
    return objectFile;
};

module.exports.initializeFile = function(filepath, data) {
    if(!fs.existsSync(filepath)) {
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

    if (!fs.existsSync(fullFileName)) {
        this.initializeDeviceConfig();
    }

    if(fs.existsSync(fullFileName)) {
        return fullFileName;
    } else{
        logger.error("Failed to find device config file!");
        process.exit(0);
    }
};

module.exports.getDeviceConfig = function() {
    var deviceConfig = this.readFileToJson(this.getDeviceConfigName());
    return deviceConfig;
};

module.exports.initializeDataDirectory = function() {
    var defaultDirectory = path.resolve('./data/');
    var currentDirectory = config["data_directory"];

    if(!currentDirectory) {
        currentDirectory = defaultDirectory;
        this.saveToConfig("data_directory", defaultDirectory);
    }

    if (!fs.existsSync(currentDirectory)) {
        fs.mkdirSync(currentDirectory);
    }
};

module.exports.initializeDeviceConfig = function() {
    if(config) {
        var dataDirectory = config['data_directory'];
        var deviceConfig = path.resolve(dataDirectory, "device.json");
        if (!fs.existsSync(deviceConfig)) {
            var dataFile = {
                "activation_retries": 10,
                "activation_code": null,
                "device_id": false,
                "device_name": false,
                "device_loc": [
                    88.34,
                    64.22047,
                    0
                ],
                "gateway_id": false,
                "device_token": "",
                "refresh_token": "",
                "account_id": "",
                "sensor_list": [],
                "last_actuations_pull_time": false
            };

            this.writeToJson(deviceConfig, dataFile);
        }
    }
};

module.exports.readConfig = function(fileName) {
    return this.readFileToJson(fileName);
};

module.exports.writeConfig = function(fileName, data) {
    this.writeToJson(fileName, data);
};

module.exports.saveToConfig = function(key, value) {
    var fileName = config.getConfigName();
    this.saveConfig(fileName, key, value);
};

module.exports.saveToDeviceConfig = function(key, value) {
    var fileName = this.getDeviceConfigName();
    this.saveConfig(fileName, key, value);
};

module.exports.saveConfig = function() {
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
        while(keys.length > 1) {
            var subtree = {};
            subtree[keys.pop()] = value;
            value = subtree;
        }
        data[keys.pop()] = value;
        return data;
    };
    data = configSaver(data, keys);
    if (data) {
        this.writeConfig(fileName, data);
    }
    return true;
};
