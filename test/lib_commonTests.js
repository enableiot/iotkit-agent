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

var assert =  require('chai').assert,
    rewire = require('rewire');
var fileToTest = "../lib/common.js";

describe(fileToTest, function(){
    var toTest = rewire(fileToTest);
    var logger = {
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
    it('Shall Return and null when it not comply with condition >', function(done) {
        var arr = [{a: 2, b: 3},
            {a: 4, b: 5},
            {a: 6, b: 7}]
        var found = toTest.firstOf(arr, function (ob) {
            return (ob.b === 15);
        });
        assert.isNull(found, "None object has returned");
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
    it('Shall Return the Index of objects At Array that comply with condition >', function(done){
        var arr = [{a: 2, b: 3}, {a: 4, b: 5}, {a: 6, b: 7}, {a: "e", b: 5}];
        var index = toTest.getIndexOf(arr, function (ob){
            return (ob.b === 5);
        });
        assert.equal(index, 1, "None Index has returned");
        index = toTest.getIndexOf(arr, function (ob){
            return (ob.b === 7);
        });
        assert.equal(index, 2, "None Index has returned");
        done();
    });
    it('Shall Return the -1 if none objects comply with condition >', function(done){
        var arr = [{a: 2, b: 3}, {a: 4, b: 5}, {a: 6, b: 7}, {a: "e", b: 5}];
        var index = toTest.getIndexOf(arr, function (ob){
            return (ob.b === "5");
        });
        assert.equal(index, -1, "None Index has returned");
        index = toTest.getIndexOf(arr, function (ob){
            return (ob.b === "xs");
        });
        assert.equal(index, -1, "None Index has returned");
        done();
    });
});
