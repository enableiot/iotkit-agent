/**
 * Created by ammarch on 4/24/14.
 */
'use strict';
var schemaValidation = require('./schema-validator'),
    common = require('./common'),
    Metric = require('./data/Metric.data').init(common);

/**
 *
 * @type {{s: string, v: number}}
 */
var sampleMetric = {"n": "temp-sensor",
                    "v": 26.7 };



var Data = function (connector, SensorStore, logT) {
    var me = this;
    me.logger = logT || {};
    me.connector = connector;
    me.store = SensorStore;
    me.validator = schemaValidation.validateSchema(schemaValidation.schemas.data.SUBMIT);

    /**
     * It will process a component registration if
     * it is not a component registration will return false
     * @param msg
     * @returns {boolean}
     */
    me.submission = function (msg) {
        if (me.validator(msg)) {
            me.logger.debug ("Data Submission Detected ", msg);
            var cid = me.store.byName(msg.n);
            var metric = new Metric();
            if (cid) {
                msg.cid = cid.cid; //Add component id to convert to Proper  Data ingestion message
                metric.set(msg);
                me.connector.dataSubmit(metric);
                return true;
            } else {
                //TODO it is returned false since it is not clear what action shall be taken
                return false;
            }
        } else {
            me.logger.debug('Data submission - Invalid message format. Expected %j got %j', sampleMetric, msg, {});
            return false;
        }

    };

};
var init = function(connector, SensorStore, logger) {
    return new Data(connector, SensorStore, logger);
};
module.exports.init = init;