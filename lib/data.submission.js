/**
 * Created by ammarch on 4/24/14.
 */
'use strict';
var schemaValidation = require('./schema-validator');

/**
 *
 * @type {{s: string, v: number}}
 */
var sampleMetric =  { "s": "temp-sensor", "v": 26.7 };

var Data = function (connector, SensorStore, logT) {
    var me = this;
    var logger = logT || {};
    me.connector = connector;
    me.validator = schemaValidation.validateSchema(schemaValidation.schemas.data.SUBMIT);

    /**
     * It will process a component registration if it is not a component registration will return false
     * @param msg
     * @returns {boolean}
     */
    me.submission = function (msg) {
        if (me.validator(msg)) {
            logger.debug ("Data Submission Detected ", msg);
            me.connector.dataSubmit(msg);
            return true;
        } else {
            logger.error('Invalid message format. Expected %j got %j', sampleMetric, msg, {});
            return false;
        }

    };

};
var init = function(connector, logger) {
    return new Data(connector, logger);
};
module.exports.init = init;