/**
 * Created by ammarch on 4/14/14.
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
        var process = handler.registration(wrongMessage);
        assert.isFalse(process, "Message Shall be not processed  invalid n key");
        wrongMessage = {
            n: "Sensor Name",
            tw: "SensorType.v1"
        };
        process = handler.registration(wrongMessage);
        assert.isFalse(process, "Message Shall be not processed Msg - invalid t key");
        wrongMessage = {
            n: 1,
            t: "SensorType.v1"
        };
        process = handler.registration(wrongMessage);
        assert.isFalse(process, "Message Shall be not processed Msg - invalid n Value");
        wrongMessage = {
            n: "",
            t: "SensorType.v1"
        };
        process = handler.registration(wrongMessage);
        assert.isFalse(process, "Message Shall be not processed Msg - invalid n Value");
        done();
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
        var process = handler.registration(okMessage);
        assert.isTrue(process, "Message Shall be processed Msg ");
        okMessage.n = "n123";
        process = handler.registration(okMessage);
        assert.isTrue(process, "Message Shall be processed Msg ");
        okMessage.t = "t123";
        process = handler.registration(okMessage);
        assert.isTrue(process, "Message Shall be processed Msg ");
        done();
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
                assert.notProperty(data, "cid" , "The object has an CID");
                assert.equal(data.name, okMessage.n, "Invalid Conversion of Name Property ");
                assert.equal(data.type, okMessage.t, "Invalid Conversion of Type Property ");
                data.cid = myCID;
                return data;
            },
            save: function (data) {
                assert.isUndefined(data, "Data shall no be passed");
                return true;
            }
        };
        connector.regComponent = function (sensor) {
            assert.isObject(sensor, "The Sensor shall be register");

            return true;
        };

        var handler = toTest.init(connector, store, logger);
        var process = handler.registration(okMessage);
        assert.isTrue(process, "Message Shall be processed Msg ");

        done();
    });
});
