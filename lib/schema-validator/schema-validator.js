'use strict';
var validator = require('json-schema');

var validate = function(obj, schema){
    return validator.validate(obj, schema).errors.map(function(e){
        e.customMessage = e.property + ' ' + e.message;
        logger.error ("Scheme Error : ", e.customMessage);
        return e;
    });
};
var validateSchema = function(schema){
    return function(data) {
        var errors = validate(data, schema);
        return (errors.length === 0);
    };
};
module.exports = {
    validate: validate,
    validateSchema: validateSchema
};