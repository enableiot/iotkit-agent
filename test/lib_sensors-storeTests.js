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

var path = require('path'),
    assert =  require('chai').assert,
    rewire = require('rewire');
var fileToTest = "../lib/sensors-store.js";

describe(fileToTest, function(){
    var logger = {
        info : function() {},
        error : function() {},
        debug : function() {}
    };
    console.debug = function() {
        console.log(arguments);
    };

    describe("Stora shall Read/Write from source", function () {
        var common = {
            readFileToJson : function (){},
            writeToJson: function(){},
            getConfig: function(){}
        };
        var toTest;
        before(function(done) {
            toTest = rewire(fileToTest);
            done();
        });
        after(function (done){
            toTest = null;
            done();
        });

        it('Shall load a data from filename specified >', function (done) {
            var dataFile = {
                "activation_retries": 10,
                "activation_code": null,
                "device_id": false,
                "device_name": false,
                "device_loc": [
                    88.34,
                    64.22047,
                    0
                ],
                "gateway_id": false,
                "deviceToken": "",
                "accountId": "",
                "sensor_list": []
            }

            var config = {
                "data_directory": "./data/"
            }

            var storeName = "deviceTest.json";

            common.getConfig = function(){
                return config;
            };

            common.readFileToJson = function (fullPath) {
                var str = "/data/" + storeName;
                assert.isString(fullPath, "The fullname is not String");
                assert.include(fullPath, str, "The store Name and Data is not include");
                return dataFile;
            };

            common.getDeviceConfig = function(){
                return dataFile;
            };

            toTest.__set__("common", common);
            var store = toTest.init(storeName, logger);
            assert.lengthOf(store.data, dataFile['sensor_list'].length, "The Data load is not the same");
            assert.deepEqual(store.data, dataFile['sensor_list'], "The Data store are missing data");
            done();
        });
        it('Shall Initialize with Empty Array when not data were save >', function (done) {
            var storeName = "deviceTest.json";
            common.readFileToJson = function (fullPath) {
                var str = "/data/" + storeName;
                assert.isString(fullPath, "The fullname is not String");
                assert.include(fullPath, str, "The store Name and Data is not include");
                return null;
            };
            toTest.__set__("common", common);
            var store = toTest.init(storeName, logger);
            assert.lengthOf(store.data, 0, "None data shall at data store");
            done();
        });
        it('Shall save data to file in JSON format>', function (done) {
            var storeName = "deviceTest.json";
            var data = [];
            common.readFileToJson = function (fullPath) {
                var str = "/data/" + storeName;
                assert.isString(fullPath, "The fullname is not String");
                assert.include(fullPath, str, "The store Name and Data is not include");
                return null;
            };

            function checkArray(dataToSave) {
                for (var i = 0; i < 100; i++) {
                    var d = i * 1000;
                    var sD = {name: d, type: d};
                    assert.equal(dataToSave[i].name, sD.name, "The name is missing at store");
                    assert.equal(dataToSave[i].type, sD.type, "The Type is missing at store");
                    assert.lengthOf(dataToSave[i].cid, 36, "The cid has not the length expected");
                }
            }

            common.saveToDeviceConfig = function (fullPath, dataToSave) {
                var str = "sensor_list";
                assert.isString(fullPath, "The fullname is not String");
                assert.include(fullPath, str, "The store Name and Data is not include");
                assert.lengthOf(dataToSave, 100, "Some Data is missing");
                checkArray(dataToSave);
                return null;
            };
            toTest.__set__("common", common);
            var store = toTest.init(storeName, logger);
            assert.lengthOf(store.data, 0, "None data shall at data store");
            for (var i = 0; i < 100; i++) {
                var d = i * 1000;
                var sD = {name: d, type: d};
                var sIn = store.add(sD);
                sD.cid = sIn.cid;
                data.push(sD);
            }
            store.save();

            done();

        });
    });
    describe(" Store Intreface ", function () {
        var myComm;
        var toTest= null;
        var storeName = "deviceTest.json";
        before(function(done) {
            toTest = rewire(fileToTest);
            myComm = require('../lib/common');
            var dataFile = {
                "activation_retries": 10,
                "activation_code": null,
                "device_id": false,
                "device_name": false,
                "device_loc": [
                    88.34,
                    64.22047,
                    0
                ],
                "gateway_id": false,
                "deviceToken": "",
                "accountId": "",
                "sensor_list": [
                    {name: 1, type: 2, cid: 3},
                    {name: 21, type: 22, cid: 23},
                    {name: 31, type: 32, cid: 33} ]
            }


            var f = path.join(__dirname, '../data/' + storeName);
            myComm.writeToJson(f, dataFile);

            myComm.getDeviceConfig = function(){
                return dataFile;
            };

            done();
        });
        after(function(done){
            toTest = null;
            done();
        });

        it('Shall return a sensor by CID >', function (done) {
            var store = toTest.init(storeName, logger);
            var c = store.byCid(23);
            assert.equal(c.cid, 23, "The component is not the expected");
            assert.equal(c.name, 21, "The component is not the expected");
            assert.equal(c.type, 22, "The component is not the expected");
            c = store.byCid(33);
            assert.equal(c.cid, 33, "The component is not the expected");
            assert.equal(c.name, 31, "The component is not the expected");
            assert.equal(c.type, 32, "The component is not the expected");
            c = store.byCid("33");
            assert.isNull(c, "it shall return a null value");
            done();
        });
        it('Shall return a sensor by Name >', function (done) {
            var store = toTest.init(storeName, logger);
            var c = store.byName(1);
            assert.equal(c.cid, 3,  "The component is not the expected");
            assert.equal(c.name, 1, "The component is not the expected");
            assert.equal(c.type, 2, "The component is not the expected");
            c = store.byName(31);
            assert.equal(c.cid, 33, "The component is not the expected");
            assert.equal(c.name, 31, "The component is not the expected");
            assert.equal(c.type, 32, "The component is not the expected");
            c = store.byName("33");
            assert.isNull(c, "it shall return a null value");
            done();
        });
        it('Shall return a sensor by Type >', function (done) {
            var store = toTest.init(storeName, logger);
            var c = store.byType(2);
            assert.equal(c.cid, 3,  "The component is not the expected");
            assert.equal(c.name, 1, "The component is not the expected");
            assert.equal(c.type, 2, "The component is not the expected");
            c = store.byType(32);
            assert.equal(c.cid, 33, "The component is not the expected");
            assert.equal(c.name, 31, "The component is not the expected");
            assert.equal(c.type, 32, "The component is not the expected");
            c = store.byType();
            assert.isNull(c, "it shall return a null value");
            done();
        });
        it('Shall return a sensor if exist >', function (done) {

            var store = toTest.init(storeName, logger);
            var c = store.exist({name: 2, type: 3});
            assert.isNull(c, "it shall return a null value");
            c = store.exist({name: 1, type: 2});
            assert.equal(c.cid, 3,  "The component is not the expected");
            assert.equal(c.name, 1, "The component is not the expected");
            assert.equal(c.type, 2, "The component is not the expected");
            done();
        });
    });
});
