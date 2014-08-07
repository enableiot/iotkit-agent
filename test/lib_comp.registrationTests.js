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
var fileToTest = "../lib/comp.registration.js";

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
            t: "SensorType.v1"
        }
       store.exist = function (data) {
                assert.isFalse(true, "The message shall not be going through");
                return true;
            };
        var handler = toTest.init(connector, store, logger);
        handler.registration(wrongMessage, function(process){
            assert.isFalse(process, "Message Shall be not processed  invalid n key");
            wrongMessage = {
                n: "Sensor Name",
                tw: "SensorType.v1"
            };
            handler.registration(wrongMessage, function(process){
                assert.isFalse(process, "Message Shall be not processed Msg - invalid t key");
                wrongMessage = {
                    n: 1,
                    t: "SensorType.v1"
                };
                handler.registration(wrongMessage, function(process){
                    assert.isFalse(process, "Message Shall be not processed Msg - invalid n Value");
                    wrongMessage = {
                        n: "",
                        t: "SensorType.v1"
                    };
                    handler.registration(wrongMessage, function(process){
                        assert.isFalse(process, "Message Shall be not processed Msg - invalid n Value");
                        done();
                    });
                });
            });
        });
   });
    it('Shall Return True if it a valid Registration Message if the Component already exist>', function(done) {
        var okMessage = {
            n: "Sensor Name",
            t: "SensorType.v1"
        };
        var store = {
            exist: function (data) {
                assert.isObject(data, "Shall be and Registration Object Representation");
                assert.property(data, "name", "The object is invalid");
                assert.property(data, "type", "The object is invalid");
                assert.equal(data.name, okMessage.n, "Invalid Conversion of Name Property ");
                assert.equal(data.type, okMessage.t, "Invalid Conversion of Type Property ");
                return true;
            }
        };
        var handler = toTest.init(connector, store, logger);
        handler.registration(okMessage, function(process){
            assert.isTrue(process, "Message Shall be processed Msg ");
            okMessage.n = "n123";
            handler.registration(okMessage, function(process){
                assert.isTrue(process, "Message Shall be processed Msg ");
                okMessage.t = "t123";
                handler.registration(okMessage, function(process){
                    assert.isTrue(process, "Message Shall be processed Msg ");
                    done();
                });

            });

        });

    });
    it('Shall Add Sensor to Store if the component does not exist >', function(done) {
        var okMessage = {
            n: "Sensor Name",
            t: "SensorType.v1"
        };
        var myCID = "my-token";
        store = {
            exist: function (data) {
                assert.isObject(data, "Shall be and Registration Object Representation");
                assert.property(data, "name", "The object is invalid");
                assert.property(data, "type", "The object is invalid");
                assert.equal(data.name, okMessage.n, "Invalid Conversion of Name Property ");
                assert.equal(data.type, okMessage.t, "Invalid Conversion of Type Property ");
                return null;
            },
            add: function (data) {
                assert.isObject(data, "Shall be and Registration Object Representation");
                assert.property(data, "name", "The object is missing Name");
                assert.property(data, "type", "The object is missing Type");
                assert.equal(data.name, okMessage.n, "Invalid Conversion of Name Property ");
                assert.equal(data.type, okMessage.t, "Invalid Conversion of Type Property ");
                data.cid =  data.cid  || myCID;
                return data;
            },
            createId: function (data) {
                data.cid = myCID;
                return data;
            },
            save: function (data) {
                assert.isUndefined(data, "Data shall no be passed");
                return true;
            }
        };
        connector.regComponent = function (sensor, callback) {
            assert.isObject(sensor, "The Sensor shall be register");
            var x = [sensor];
            x.status = 0;
            callback(x);
        };

        var handler = toTest.init(connector, store, logger);
        handler.registration(okMessage, function(process){
           assert.equal(process.status, 0, "Message Shall be processed Msg ");
           done();
        });

    });
});
