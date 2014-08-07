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
var schemaValidation = require('./schema-validator');

/**
 * Sample Message the will be built in order to registrate component to IOT Analytics
 * @type {{cid: string, name: string, type: string}}
 */
var sampleCompReg = {
    "n": "Temperature Sensor 1",
    "t": "temperature.v1.0"
};

var Component = function (connector, SensorStore, logT) {
    var me = this;
    var logger = logT || {};
    me.connector = connector;
    me.store = SensorStore;
    schemaValidation.setLogger(logger);
    me.regValidator = schemaValidation.validateSchema(schemaValidation.schemas.component.REG);

    /**
     * It will process a component registration if it is not a componet registration will return false
     * @param msg
     * @returns {boolean}
     */

    me.registration = function (msg, callback) {
        if (me.regValidator(msg)) {
            logger.debug ("Component Registration detected ", msg);
            var sen = {name: msg.n,
                       type: msg.t};
            var comp = me.store.exist(sen);
            /**
             * if Component Exist an has different type
             */
            if (!comp) {
                sen = me.store.createId(sen);
                me.connector.regComponent(sen, function (com) {
                    if (com.status === 0) {
                        sen = com[0] || com;
                        me.store.add(sen);
                        me.store.save();
                    } else {
                        me.store.del(sen.cid);
                    }
                    return callback(com);
                });
            } else {
                logger.error("Component already Exist at Agent ", comp);
                return callback(true);
            }

         } else {
            logger.debug('Comp. registration - Invalid message format. Expected %j got %j', sampleCompReg, msg, {});
            return callback(false);
        }

    };
    me.deregister = function (msg) {
        if (me.desregValidator(msg)) {
            var sen = {name: msg.n,
                        type: msg.t};
            var comp = me.store.delete(sen);
            /**
             * if Component Exist an has different type
            */
            if (!comp) {
                me.connector.desRegComponent(sen);
                me.store.save();
            }
            return true;
        } else {
            logger.info('Invalid message format. Expected %j got %j', sampleCompReg, msg, {});
            return false;
        }
    };

};
var init = function(connector, SensorStore, logger) {
    return new Component(connector, SensorStore, logger);
};
module.exports.init = init;
