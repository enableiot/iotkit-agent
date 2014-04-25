/**
 * Created by ammarch on 4/14/14.
 */
var assert =  require('chai').assert,
    rewire = require('rewire');
var fileToTest = "../lib/sensors-store.js";

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
    var common = {
        readFileToJson : function (){},
        writeToJson: function(){}
    };


    it('Shall load a data from filename specified >', function(done) {
        var dataFile = [{name: 1, type:2, cid: 3},
                        {name: 21, type:22, cid: 23},
                        {name: 31, type:32, cid: 33}];

        var storeName = "sensorTest-list.json";
        common.readFileToJson = function (fullPath) {
            var str =  "/data/" + storeName;
            assert.isString(fullPath, "The fullname is not String");
            assert.include(fullPath, str, "The store Name and Data is not include");
            return dataFile;
        };
        toTest.__set__("common", common);
        var store = toTest.init(storeName, logger);
        assert.lengthOf(store.data, dataFile.length, "The Data load is not the same");
        assert.deepEqual(store.data, dataFile, "The Data store are missing data");
        done();
    });
    it('Shall Initialize with Empty Array when not data were save >', function(done) {
        var storeName = "sensorTest-list.json";
        common.readFileToJson = function (fullPath) {
            var str =  "/data/" + storeName;
            assert.isString(fullPath, "The fullname is not String");
            assert.include(fullPath, str, "The store Name and Data is not include");
            return null;
        };
        toTest.__set__("common", common);
        var store = toTest.init(storeName, logger);
        assert.lengthOf(store.data, 0, "None data shall at data store");
        done();
    });

    it('Shall save data to file in JSON format>', function(done) {
        var storeName = "sensorTest-list.json";
        var data = [];
        common.readFileToJson = function (fullPath) {
            var str =  "/data/" + storeName;
            assert.isString(fullPath, "The fullname is not String");
            assert.include(fullPath, str, "The store Name and Data is not include");
            return null;
        };
        function checkArray (dataToSave) {
            for (var i= 0; i< 100;i++){
                var d = i * 1000;
                var sD = {name: d, type: d};
                assert.equal(dataToSave[i].name, sD.name, "The name is missing at store");
                assert.equal(dataToSave[i].type, sD.type, "The Type is missing at store");
                assert.lengthOf(dataToSave[i].cid, 36, "The cid has not the length expected");

            }
       }
        common.writeToJson = function (fullPath, dataToSave) {
            var str =  "/data/" + storeName;
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
    it('Shall return a sensor by CID >', function(done) {
        done();
    });
    it('Shall return a sensor by Name >', function(done) {
        done();
    });
    it('Shall return a sensor by Type >', function(done) {
        done();
    });
    it('Shall return a sensor if exist >', function(done) {
        done();
    });
});
