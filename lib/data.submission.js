/**
 * Created by ammarch on 4/24/14.
 */
'use strict';
var schemaValidation = require('./schema-validator'),
    common = require('./common');

/**
 *
 * @type {{s: string, v: number}}
 */
var sampleMetric =  { "s": "temp-sensor", "v": 26.7 };

/**
 * Build a Data Ingestion Message to be sent to MQTT
 * @constructor
 */

function Metric () {

    this.on = common.timeStamp();
    this.count = 1;
    this.data = [];

}
Metric.prototype.convert= function(msg) {
    this.on = msg.on || this.on;
    var data = { "cid": msg.cid,
                 "on": this.on,
                 "loc": msg.loc,
                 "value": msg.v
                };
    if (msg.att) {
        data.attributes = msg.att;
    }
    this.data = data;
    this.count = this.data.length;
};



var Data = function (connector, SensorStore, logT) {
    var me = this;
    var logger = logT || {};
    me.connector = connector;
    me.store = SensorStore;
    me.validator = schemaValidation.validateSchema(schemaValidation.schemas.data.SUBMIT);

    /**
     * It will process a component registration if it is not a component registration will return false
     * @param msg
     * @returns {boolean}
     */
    me.submission = function (msg) {
        if (me.validator(msg)) {
            logger.debug ("Data Submission Detected ", msg);
            var cid = me.store.byName(msg.n);
            var metric = new Metric();
            if (cid) {
                msg.cid = cid.cid; //Add component id to convert to Proper  Data ingestion message
                metric = metric.convert(msg);
                me.connector.dataSubmit(metric);
            }
            return true;
        } else {
            logger.error('Invalid message format. Expected %j got %j', sampleMetric, msg, {});
            return false;
        }

    };

};
var init = function(connector, SensorStore, logger) {
    return new Data(connector, SensorStore, logger);
};
module.exports.init = init;