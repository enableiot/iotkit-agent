/*
Copyright (c) 2014, Intel Corporation

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

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
var validator = require('json-schema');
var logger = require('../logger').init();
/**
 *
 * @param obj
 * @param schema
 * @returns {Array}
 */
var validate = function(obj, schema) {
    return validator.validate(obj, schema).errors.map(function(e) {
        logger.debug("Scheme Error: %s", e.message);
        return e;
    });
};

var parseErrors = function(result, cb) {
    var msg = '';
    if (result.length > 0) {
        for (var i = 0; i < result.length; i++) {
            //validate method from schema-validator returns error message in which on first place there is filed
            //identifier (n - for name; t - for type)
            msg += result[i].customMessage.replace(new RegExp(/^n/), 'name').replace(/^t/, 'type') +
                ((i + 1) < result.length ? ', ' : '');
        }
    }
    cb(msg);
};

/**
 * @description it will validate the json schema
 * @param schema
 * @returns {Function}
 */
var validateSchema = function(schema) {
    /**
     * @description it will validate the json schema
     * @param data
     * @return {bool}
     */
    return function(data) {
        var errors = validate(data, schema);
        return (errors.length === 0);
    };
};
module.exports = {
    validate: validate,
    validateSchema: validateSchema,
    setLogger: function (log) {
        logger = log;
    },
    parseErrors: parseErrors
};
