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
var fileToTest = "../lib/data.submission.js";

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
    var connector = {};
    var store = {

    };
    it('Shall Return False if not a Registration Message >', function(done) {
        var wrongMessage = {
            x: "Sensor Name",
            v: "31"
        }
       store.exist = function (data) {
                assert.isFalse(true, "The message shall not be going through");
                return true;
            };
        var handler = toTest.init(connector, store, logger);
        var process = handler.submission(wrongMessage, function (process){
            assert.isFalse(process, "Message Shall be not processed  invalid n key")
            //  assert.isFalse(process, "Message Shall be not processed  invalid n key");
            wrongMessage = {
                n: "Sensor Name",
                tw: "SensorType.v1"
            };
            handler.submission(wrongMessage, function(process){
                assert.isFalse(process, "Message Shall be not processed Msg - invalid t key");
                wrongMessage = {
                    n: 1,
                    v: "SensorType.v1"
                };
                handler.submission(wrongMessage, function(process){
                    wrongMessage = {
                        n: "",
                        v: "SensorType.v1"
                    };
                    handler.submission(wrongMessage ,function(process) {
                        assert.isFalse(process, "Message Shall be not processed Msg - invalid n Value");
                        done();
                    });
                });
            });
        });
     });
    it('Shall Return True if it a valid Registration Message >', function(done) {
        var okMessage = {
            n: "Sensor Name",
            v: 1000,
            on: 1234567890
        };
        var ci = { cid: "thisCID",
                   n: okMessage.n,
                   t: "thisT"};
        var store = {
            byName: function (name) {
                assert.isString(name, "Shall be the name of the Component");
                assert.equal(name, okMessage.n, "Invalid Conversion of Name Property ");
                return ci;
            }
        };

        connector.dataSubmit = function (metric, callback) {
            assert.isObject(metric, " Shall be an object");
            assert.property(metric, "on", "It is required the ON Message");
            assert.equal(metric.on, okMessage.on, "The TimeStamp were not propagated");
            assert.equal(metric.count, 1, " The count shall be 1");
   //         done();
            callback(true);
            return;
        };
        var handler = toTest.init(connector, store, logger);
        handler.submission(okMessage, function(status){
            assert.isTrue(status, "Message Shall be processed Msg ");
            done();
        });

    });
    it('Shall Return False if it a valid Registration Message but the Component not exist >', function(done) {
        var okMessage = {
            n: "Sensor Name",
            v: 1000,
            on: 1234567890
        };
        var ci = { cid: "thisCID",
            n: okMessage.n,
            t: "thisT"};
        var store = {
            byName: function (name) {
                assert.isString(name, "Shall be the name of the Component");
                assert.equal(name, okMessage.n, "Invalid Conversion of Name Property ");
                return null;
            }
        };

        connector.dataSubmit = function (metric, callback) {
            assert.isObject(metric, " Shall be an object");
            assert.property(metric, "on", "It is required the ON Message");
            assert.equal(metric.on, okMessage.on, "The TimeStamp were not propagated");
            assert.equal(metric.count, 1, " The count shall be 1");
            //         done();
            callback();
         };
        var handler = toTest.init(connector, store, logger);
        handler.submission(okMessage, function (process){
            assert.isTrue(process, "Message Shall be processed Msg ");
            done();
        });
    });

});
