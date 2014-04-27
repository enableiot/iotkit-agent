/**
 * Created by ammarch on 4/14/14.
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
        var process = handler.submission(wrongMessage);
        assert.isFalse(process, "Message Shall be not processed  invalid n key");
        wrongMessage = {
            n: "Sensor Name",
            tw: "SensorType.v1"
        };
        process = handler.submission(wrongMessage);
        assert.isFalse(process, "Message Shall be not processed Msg - invalid t key");
        wrongMessage = {
            n: 1,
            v: "SensorType.v1"
        };
        process = handler.submission(wrongMessage);
        assert.isFalse(process, "Message Shall be not processed Msg - invalid n Value");
        wrongMessage = {
            n: "",
            v: "SensorType.v1"
        };
        process = handler.submission(wrongMessage);
        assert.isFalse(process, "Message Shall be not processed Msg - invalid n Value");
        done();
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

        connector.dataSubmit = function (metric) {
            assert.isObject(metric, " Shall be an object");
            assert.property(metric, "on", "It is required the ON Message");
            assert.equal(metric.on, okMessage.on, "The TimeStamp were not propagated");
            assert.equal(metric.count, 1, " The count shall be 1");
   //         done();
            return;
        };
        var handler = toTest.init(connector, store, logger);
        var process = handler.submission(okMessage);

        assert.isTrue(process, "Message Shall be processed Msg ");
        done();
    });

});
