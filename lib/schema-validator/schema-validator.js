'use strict';
var validator = require('json-schema');

var logger = {};
/**
 *
 * @param obj
 * @param schema
 * @returns {Array}
 */
var validate = function(obj, schema){
    return validator.validate(obj, schema).errors.map(function(e){
        e.customMessage = e.property + ' ' + e.message;
        logger.error ("Scheme Error : ", e.customMessage);
        return e;
    });
};


/**
 * @description it will validate the json schema
 * @param schema
 * @returns {Function}
 */
var validateSchema = function(schema){
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
    }
};