/**
 * Created by ammarch on 5/21/14.
 */

var logger = require("../lib/logger").init(),
    common = require('../lib/common'),
    utils = require("../lib/utils").init(),
    config = require('../config'),
    activator = require("../lib/activate"),
    path = require('path');

module.exports.save = function save () {
    if (arguments.length < 1) {
        logger.error("Not enough arguments : ", arguments);
        process.exit(1);
    }
    var code = arguments[0];
    var filename = "agent-ids.json";
    var fullFilename = path.join(__dirname, '../certs/' +  filename);
    var data = common.readFileToJson(fullFilename);

    logger.info("Code to Set : ", code);
    data.activation_code = code;
    return common.writeToJson(fullFilename, data);
};

module.exports.activate = function activate() {
    if (arguments.length < 1) {
        logger.error("Not enough arguments : ", arguments);
        process.exit(1);
    }
    var code = arguments[0];
    utils.getDeviceId(function (id) {
        activator.activate(id, code, function () {
            activator.disconnect();
            process.exit(0);            
        });
    });
};
module.exports.reset = function reset () {
    var dataTokenReset =  {
        "deviceToken": false,
        "accountId": false
    };
    var fullFilename = path.join(__dirname, '../certs/' +  config.token_file);
    return common.writeToJson(fullFilename, dataTokenReset);
};
