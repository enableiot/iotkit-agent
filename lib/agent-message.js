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
var Comp = require('./comp.registration'),
    Data = require('./data.submission'),
    Sensor = require('./sensors-store'),
    schemaValidation = require('./schema-validator'),
    updTable = require('./server/upd.table').singleton();

var MessageHandler = function(connector, logger) {
    var me = this;
    me.store = Sensor.init("sensor-list.json", logger);
    me.comp = Comp.init(connector, me.store, logger);
    me.data = Data.init(connector,  me.store, logger);

    me.handler = function (msg, callback, msgSchema) {
        if (msgSchema) {
            me.validator = schemaValidation.validate(msg, msgSchema);
        } else {
            me.validator = schemaValidation.validate(msg, schemaValidation.schemas.routing.ROUTE);
        }

        var msgResult = [];

        if (me.validator.length === 0) {
            updTable.add(msg.n, msg.r);
            delete msg.r;
            me.data.submission(msg, function (status_sub) {
                if (status_sub === false) {
                    msgResult.push(new Error("None Submit data matching"));
                    me.comp.registration(msg, function (status_reg) {
                        if (status_reg === false) {
                            msgResult.push(new Error("None Registration Component Matching"));
                            logger.error('Invalid message received (empty) : ', msg, msgResult);
                        }
                        if (callback) {
                            return callback(status_reg);
                        }
                    });
                    return;
                }
                if (callback) {
                    callback(status_sub);
                }

            });
        } else {
            schemaValidation.parseErrors(me.validator, callback);
        }
    };
};

var init = function(connector, logger) {
    return new MessageHandler(connector, logger);
};
module.exports = {
    init : init
};
