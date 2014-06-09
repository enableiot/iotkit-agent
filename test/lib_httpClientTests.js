var assert =  require('chai').assert,
    rewire = require('rewire');

var fileToTest = "../lib/httpClient.js";

describe(fileToTest, function(){
    var toTest = rewire(fileToTest);

    var logger  = {
        info : function(){},
        error : function() {},
        debug : function() {}
    };

    console.debug = function() {
        console.log(arguments);
    };
    var resp = {
        statusCode: 200,
        headers: {'content-type': "application/json"}
    };
    it('Shall Connect to Specific Broker using HTTP >', function(done){
        var body = {
            a:1,
            b:2,
            x:[]
        };
        var myOption = {
            host: "myhosta",
            port: 911,
            path: "mypath",
            protocol: "http",
            method: "POSTEO",
            body: {x:2,c:34},
            headers: {"content": "json"}
        };
        var request = function (option, callback) {
            assert.isNotNull(option, "The option is missing");
            assert.isFunction(callback, "The callback is not a function");
            assert.deepEqual(option, myOption);
            callback(null, resp, JSON.stringify(body));
        };
        toTest.__set__("request", request);
        toTest.httpRequest(myOption, function(err, result){
           assert.isObject(result, "The result data is not an object");
           assert.isNull(err, "The error shall be null");
           assert.deepEqual(result, body, "The result were missinge");
           done();

        });
    });
    it('Shall Connect to Specific Broker using HTTP with a 201 as Status code >', function(done){
        var body = {
            a:1,
            b:3,
            x:[]
        };
        var myOption = {
            host: "myhostaTestingDos",
            port: 9121,
            path: "mypath",
            protocol: "http",
            method: "POSTEO",
            body: {x:2,c:34},
            headers: {"content": "json"}
        };
        var request = function (option, callback) {
            assert.isNotNull(option, "The option is missing");
            assert.isFunction(callback, "The callback is not a function");
            assert.deepEqual(option, myOption);
            var resp = {
                statusCode: 201,
                headers: {'content-type': "application/json"}
            };
            callback(null, resp, JSON.stringify(body));
        };
        toTest.__set__("request", request);
        toTest.httpRequest(myOption, function(err, result){
            assert.isObject(result, "The result data is not an object");
            assert.isNull(err, "the error shall be null");
            assert.deepEqual(result, body, "The result were missinge");
            done();

        });
    });
    it('Shall Connect to Specific Broker using HTTP with a 204 as Status code >', function(done){
        var body = {
            a:1,
            b:3,
            x:[]
        };
        var myOption = {
            host: "myhostaTestingDos",
            port: 9121,
            path: "mypath",
            protocol: "http",
            method: "POSTEO",
            body: {x:2,c:34},
            headers: {"content": "json"}
        };
        var request = function (option, callback) {
            assert.isNotNull(option, "The option is missing");
            assert.isFunction(callback, "The callback is not a function");
            assert.deepEqual(option, myOption);
            var resp = {
                statusCode: 204,
                headers: {'content-type': "application/json"}
            };
            callback(null, resp, null);
        };
        toTest.__set__("request", request);
        toTest.httpRequest(myOption, function(err, result){
            assert.isObject(result, "The result data is not an object");
            assert.isNull(err, "The error shall be null");
            assert.equal(result.status, "Done", "The result were missing");
            done();

        });
    });
    it('Shall Return Null when the Payload could not be decoded >', function(done) {
        var body = {
            a:1,
            b:2,
            x:[]
        };
        var myOption = {
            host: "myhosta",
            port: 911,
            method: "POSTEO",
            body: {x:2,c:34},
            headers: {"content": "json"}
        };
        var request = function (option, callback) {
            assert.isNotNull(option, "The option is missing");
            assert.isFunction(callback, "The callback is not a function");
            assert.deepEqual(option, myOption);
            callback(null, resp, "@@@@");
        };
        toTest.__set__("request", request);
        toTest.httpRequest(myOption, function(result){
            assert.isNull(result, "The result data shall be null");
            done();

        });
    });
});
