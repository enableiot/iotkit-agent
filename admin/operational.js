/**
 * Created by ammarch on 5/21/14.
 */

var logger = require("../lib/logger").init(),
    common = require('../lib/common'),
    Cloud = require("../api/cloud.proxy"),
    utils = require("../lib/utils").init(),
    config = require('../config'),
    path = require('path');

var saveCode = function () {
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
var resetToken = function () {
    var dataTokenReset =  {
        "deviceToken": false,
        "accountId": false
    };
    var fullFilename = path.join(__dirname, '../certs/' +  config.token_file);
    return common.writeToJson(fullFilename, dataTokenReset);
};
var activate = function () {
    if (arguments.length < 1) {
        logger.error("Not enough arguments : ", arguments);
        process.exit(1);
    }
    var code = arguments[0];
    utils.getDeviceId(function (id) {
        var cloud = Cloud.init(config, logger, id);
        cloud.activate(code, function (err) {
            var r = 0;
            cloud.disconnect();
            if (!err) {
                logger.info("Device Activated ");
            } else {
                logger.error("Error in the activation process ...", err);
                r = 1;
            }
            process.exit(r)
        });
    });
};


module.exports = {
    addCommand : function (program) {
        program.option('-a, --activate <activaton code>', 'activate and send metadata');
        program.option('-i, --initialize', 'reset both the token and the components list')
   /*     program.option('-c, --savecode <activaton code>', 'add activation code to agent');
        program.option('-C, --resetcode', 'clear added code');*/
        program.option('-R, --resettoken', 'clear Device Token');
    },
    runCommand: function (program) {
       /* if (program.savecode) {
            saveCode(program.savecode);
        } else if (program.resetcode) {
            saveCode(false);
        }*/
        if (program.resetoken){
            resetToken();
        } else if (program.activate) {
            logger.info("activate and send metadata");
            activate(program.activate);
        }
        if (program.initialize) {
            resetToken();
            saveCode(false);
        }

    }
};