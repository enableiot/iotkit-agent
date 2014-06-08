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

'use strict';
var schemaValidation = require('./schema-validator'),
    common = require('./common'),
    Metric = require('./data/Metric.data').init(common);

/**
 *
 * @type {{n: string, v: number}}
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
    me.submission = function (msg, callback) {
        if (me.validator(msg)) {
            me.logger.info ("Submitting: ", msg);
            var cid = me.store.byName(msg.n);
            var metric = new Metric();
            if (cid) {
                msg.cid = cid.cid; //Add component id to convert to Proper  Data ingestion message
                metric.set(msg);
                me.connector.dataSubmit(metric, function(dat){
                    me.logger.info("Response received: ", dat);
                    return callback(dat);
                });
            } else {
                me.logger.error('Data submission - could not find time series with the name: %s.', msg.n);
                return callback(true);
            }
        } else {
            me.logger.debug('Data submission - No detected Expected %j got %j', sampleMetric, msg, {});
            return callback(false);
        }
    };

};
var init = function(connector, SensorStore, logger) {
    return new Data(connector, SensorStore, logger);
};
module.exports.init = init;