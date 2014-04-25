/**
 * Created by ammarch on 4/24/14.
 */
'use strict';
var schemaValidation = require('./schema-validator');

/**
 * Sample Message the will be built in order to registrate component to IOT Analytics
 * @type {{cid: string, name: string, type: string}}
 */
var sampleCompReg = {
    "cid": "436e7e74-6771-4898-9057-26932f5eb7e1",
    "name": "Temperature Sensor 1",
    "type": "temperature.v1"
};

var Component = function (connector, SensorStore, logT) {
    var me = this;
    var logger = logT || {};
    me.connector = connector;
    me.store = SensorStore;
    schemaValidation.setLogger(logger);
    me.validator = schemaValidation.validateSchema(schemaValidation.schemas.component.REG);

    /**
     * It will process a component registration if it is not a componet registration will return false
     * @param msg
     * @returns {boolean}
     */
    me.registration = function (msg) {
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
        }
        logger.error('Invalid message format. Expected %j got %j', sampleCompReg, msg, {});
        return false;

    };

};
var init = function(connector, SensorStore, logger) {
    return new Component(connector, SensorStore, logger);
};
module.exports.init = init;
