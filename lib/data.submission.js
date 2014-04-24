/**
 * Created by ammarch on 4/24/14.
 */
'use strict';
var logger;
var common = require('./common'),
    schemaValidation = require('./schema-validator');

/**
 *
 * @type {{s: string, v: number}}
 */
var sampleMetric =  { "s": "temp-sensor", "v": 26.7 };

var data = function (connector, SensorStore, logT) {
    var me = this;
    var logger = logT || {};
    me.connector = connector;
    me.store = SensorStore;
    me.validator = schemaValidation.validateSchema(schemaValidation.schemas.data.SUBMIT);

    /**
     * It will process a component registration if it is not a componet registration will return false
     * @param msg
     * @returns {boolean}
     */
    me.submission = function (msg) {
        if (me.validator(msg)) {
            logger.debug ("Component Registration detected ", msg);
            var sen = {name: msg.n,
                       type: msg.t};
            var comp = me.store.exist(sen);
            /**
             * if Component Exist an has different type
             */
            if (!comp) {
                sen = SensorStore.add(sen);
                me.connector.regComponent(sen);
                SensorStore.save(sen);
            }
            return true;
        } else {
            logger.error('Invalid message format. Expected %j got %j', sampleReg, msg, {});
            return false;
        }

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