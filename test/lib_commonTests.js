/**
 * Created by ammarch on 4/14/14.
 */
var assert =  require('chai').assert,
    rewire = require('rewire');

var fileToTest = "../lib/common.js";

describe(fileToTest, function(){
    var toTest = rewire(fileToTest);
    var logger  = {
        info : function() {},
        error : function() {},
        debug : function() {}
    };
    console.debug = function() {
        console.log(arguments);
    };
    it('Shall Return the object comply with condition >', function(done) {
        var arr = [{a: 2, b: 3},
                   {a: 4, b: 5},
                   {a: 6, b: 7}]
        var found = toTest.firstOf(arr, function (ob) {
           return (ob.b === 5);
        });
        assert.isObject(found, "None object has returned");
        assert.property(found, "b", "It is not an object expected")
        assert.equal(found.b, arr[1].b, "Wrong object has returned");
        done();

    });
    it('Shall Return and empty object when it not comply with condition >', function(done) {
        var arr = [{a: 2, b: 3},
            {a: 4, b: 5},
            {a: 6, b: 7}]
        var found = toTest.firstOf(arr, function (ob) {
            return (ob.b === 15);
        });
        assert.isObject(found, "None object has returned");
        assert.notProperty(found, "b", "It is not an object expected");
        assert.deepEqual(found, {}, "Wrong object has returned");
        done();

    });
    it('Shall Filter the objects comply with condition >', function(done){
        var arr = [{a: 2, b: 3}, {a: 4, b: 5}, {a: 6, b: 7}, {a: "e", b: 5}]
        var found = toTest.filterBy(arr, function (ob){
            return (ob.b === 5);
        });
        assert.isArray(found, "None object has returned");
        assert.lengthOf(found,2, "Some object has missed in the filter operation");
        done();
    });
    it('Shall None Filter any if object it not comply with condition >', function(done){
        var arr = [{a: 2, b: 3}, {a: 4, b: 5}, {a: 6, b: 7}, {a: "e", b: 5}]
        var found = toTest.filterBy(arr, function (ob){
            return (ob.b === 15);
        });
        assert.isArray(found, "None object has returned");
        assert.lengthOf(found,0, "Some object has missed in the filter operation");
        done();
    });
});
