/**
 * Created by ammarch on 4/24/14.
 */
'use strict';
var cloud;
var logger;
var common = require('../lib/common');

var sampleReg = { "s": "temp-sensor",
    "t": "float",
    "u": "Celsius" };


/**
 * Sample Message the will be built in order to registrate component to IOT Analytics
 * @type {{cid: string, name: string, type: string}}
 */
var sampleCompReg = {
    "cid": "436e7e74-6771-4898-9057-26932f5eb7e1",
    "name": "Temperature Sensor 1",
    "type": "temperature.v1"
};
/**
 * @description it will validate the json schema
 * @param msg
 * @return {bool}
 */
var validateSchema = function (msg) {
    //TODO Validate Schema using json-schema


    return true;
};

var component = function (connector, logT) {
    var me = this;
    var logger = logT || {};
    me.connector = connector;
    function msgRegistration (msg, callback) {

        if (validateSchema(msg)) {
            logger.debug ("Component Registration detected ", msg);

            return true;
        } else {
            logger.error('Invalid message format. Expected %j got %j', sampleReg, msg, {});
            return false;
        }

    }
    return {
    };
};



module.exports.handler = function (msg) {



};




var messageHandler = function(msg) {
    logger.debug("JSON Message: ", msg);
    if (msg === undefined) {
        logger.error('Invalid message received (empty)');
        return;
    }
    if (msg.v !== undefined) {
        // This is a metric message
        // Validate the input args
        if (msg.s === undefined  || msg.v === undefined) {
            logger.error('Invalid message format. Expected %j got %j', sampleMetric, msg, {});
            return;
        }
        if (!cloud.registrationCompleted) {
            logger.error('Cloud device registration has not been yet completed.');
            return;
        }
        if (cloud.sensorsList[msg.s] === undefined) {
            logger.error('The requested sensor: %s have not been registered.', msg.s);
            return;
        }
        // send it anyway
        cloud.metric(msg);
    } else {
        // This is a registration message
        // Validate the input args
        if (!msg.s) {
            logger.error('Invalid message format. Expected %j got %j', sampleReg, msg, {});
            return;
        }
        if (!cloud.registrationCompleted) {
            logger.error('Cloud device registration has not been yet completed.');
            return;
        }
        cloud.sensorsList[msg.s] = {
            units: msg.u || 'number',
            data_type: msg.t || 'float',
            name: msg.s,
            items: 1 };
        cloud.reg();
    }
};
var init = function(loggerObj, cloudObj) {
    logger = loggerObj;
    cloud = cloudObj;
};
module.exports.init = init;
module.exports.messageHandler = messageHandler;