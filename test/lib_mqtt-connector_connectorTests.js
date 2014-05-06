var assert =  require('chai').assert,
    rewire = require('rewire');


var fileToTest = "../lib/mqtt-connector/connector";

describe(fileToTest, function(){
    var toTest = rewire(fileToTest);

    var client = {
            subscribe: {},
            publish: {},
            on: function() {}
        };
    var mqtt = {
            createSecureClient : function() {},
            createClient : function() {}
        };

    var logger  = {
        info : function(){},
        error : function() {},
        debug : function() {}
    };

    console.debug = function() {
        console.log(arguments);
    };
    it('Shall Connect to Specific Broker using HTTP >', function(done){
        toTest.__set__("mqtt", mqtt);

        var config = {
                host: "myHosttest",
                port: 9090909,
                secure: false,
                retries: 2
            },
            id = "0a-03-12-22";

        var myBroker = new toTest(config, logger, id);

        mqtt.createClient = function (port, host ) {
            assert.lengthOf(arguments, 2, "Missing Argument for Secure Connection");
            assert.equal(port, config.port, "The port has override");
            assert.equal(host, config.host, "The host has override");
            client.connected = true;
            return client;
        };
        myBroker.connect(function(err) {
            assert.isNull(err, "None error shall returned");
            done();
        });
    });
    it('Shall Connect to Specific Broker >', function(done){
        toTest.__set__("mqtt", mqtt);
        var config = {
                    host: "myHosttest",
                    port: 9090909,
                    secure: true,
                    retries: 2
                    },
            id = "0a-03-12-22";
        var myBroker = new toTest(config, logger, id);
        mqtt.createSecureClient = function (port, host, args ) {
            assert.lengthOf(arguments, 3, "Missing Argument for Secure Connection");
            assert.equal(port, config.port, "The port has override");
            assert.equal(host, config.host, "The host has override");
            client.connected = true;
            return client;
        };
        myBroker.connect(function(err) {
            assert.isNull(err, "Not Spected error Returned");
            done();
        });
    });
    it('Shall Retries to Connect to Specific Broker >', function(done){
        toTest.__set__("mqtt", mqtt);

        var config = {
                host: "myHosttest",
                port: 9090909,
                secure: true,
                retries: 5
            },
            id = "0a-03-12-22";

        var myBroker = new toTest(config, logger, id);

        mqtt.createSecureClient = function (port, host, args ) {
            assert.lengthOf(arguments, 3, "Missing Argument for Secure Connection");
            assert.equal(port, config.port, "The port has override");
            assert.equal(host, config.host, "The host has override");
            client.connected = false;
            return client;
        };


        myBroker.connect(function(err) {
            assert.isNull(err, "None error shall be returned");
            done();
        });

        setTimeout(function(){
           client.connected = true;
        }, 1000);


    });
    it('Shall Report Error After # Retries >', function(done) {
        toTest.__set__("mqtt", mqtt);
        var config = {
                host: "myHosttest",
                port: 9090909,
                secure: true,
                retries: 2
            },
            id = "0a-03-12-22";
        var myBroker = new toTest(config, logger, id);
        mqtt.createSecureClient = function (port, host, args ) {
            assert.lengthOf(arguments, 3, "Missing Argument for Secure Connection");
            assert.equal(port, config.port, "The port has override");
            assert.equal(host, config.host, "The host has override");
            client.connected = false;
            return client;
        };
        myBroker.connect(function(err) {
            assert.instanceOf(err, Error, "Invalid error reported");
            assert.equal(err.message, "Connection Error", "Invalid Message error  Reported");
            done();
        });
    });
    it('Shall Publish to Specific Broker Topic >', function(done) {
        toTest.__set__("mqtt", mqtt);
        var config = {
                host: "myHosttest",
                port: 9090909,
                secure: true,
                retries: 12
            },
            id = "0a-03-12-22";
        var myTopic ="/device/topox/{1}/xxxx";
        var myMessage = {
            a: "test",
            b: 12323
        }
        mqtt.createSecureClient = function (port, host, args ) {
            assert.lengthOf(arguments, 3, "Missing Argument for Secure Connection");
            assert.equal(port, config.port, "The port has override");
            assert.equal(host, config.host, "The host has override");
            client.connected = true;
            return client;
        };


        var myBroker = new toTest(config, logger, id);
        client.publish = function (topic, message) {
            assert.equal(topic, myTopic, "Missing the topics");
            assert.equal(message, JSON.stringify(myMessage), "Missing the Message");
            done();
        };
        myBroker.connect(function(err) {
            assert.isNull(err, Error, "Invalid error reported");
            myBroker.publish(myTopic, myMessage);
        });


    });
    it('Shall Notified to Specific topic handler >', function (done) {
        toTest.__set__("mqtt", mqtt);
        var config = {
                host: "myHosttest",
                port: 9090909,
                secure: false,
                retries: 2
            },
            id = "0a-03-12-22";
        var realTopic = 'dev/' + id + '/act';
        var msg = {
            a: 1,
            c: 2
        };
        var myBroker = new toTest(config, logger, id);
        mqtt.createClient = function (port, host ) {
            assert.lengthOf(arguments, 2, "Missing Argument for Secure Connection");
            assert.equal(port, config.port, "The port has override");
            assert.equal(host, config.host, "The host has override");
            client.connected = true;
            return client;
        };
        var topicPattern = 'dev/+/act' ;
        var topicHandler = function(topic, message) {
            assert.equal(topic, realTopic, "The topis is not the expected");
            done();
        };
        client.subscribe = function (vtopic, cb) {
            var granted = [{ topic: vtopic}];
            cb(null, granted);
        };
        myBroker.connect(function(err) {
           assert.isNull(err, "None error shall returned");
           myBroker.bind(topicPattern, topicHandler);
           myBroker.onMessage(realTopic, msg);
        });
    });
    it('Shall Listen to on Message >', function (done) {
        toTest.__set__("mqtt", mqtt);
        var config = {
                host: "myHosttest",
                port: 9090909,
                secure: false,
                retries: 2
            },
            id = "0a-03-12-22";
        var realTopic = 'dev/' + id + '/act';
        var msg = {
            a: 1,
            c: 2
        };
        var myBroker = new toTest(config, logger, id);


        var callHandler = null;
        client.on = function (event, handler) {
            assert.isFunction(handler, "The handle shall be a function");
            assert.isString(event, "The event shall be string");
            assert.equal(event, "message", "Invalid event listeneter");
            callHandler = handler;
           // handler("conmector", JSON.stringify(msg));
        }

        mqtt.createClient = function (port, host ) {
            assert.lengthOf(arguments, 2, "Missing Argument for Secure Connection");
            assert.equal(port, config.port, "The port has override");
            assert.equal(host, config.host, "The host has override");
            client.connected = true;
            return client;
        };



        myBroker.connect(function(err) {
            assert.isNull(err, "None error shall returned");
            callHandler("conmector", JSON.stringify(msg));
            done();
        });
    });
    it('Shall Listen to on Message > with specific topic handler >', function (done) {
        toTest.__set__("mqtt", mqtt);
        var config = {
                host: "myHosttest",
                port: 9090909,
                secure: false,
                retries: 2
            },
            id = "0a-03-12-22";
        var realTopic = 'dev/' + id + '/act';
        var msg = {
            a: 1,
            c: 2
        };
        var callHandler = null;
        client.on = function (event, handler) {
            assert.isFunction(handler, "The handle shall be a function");
            assert.isString(event, "The event shall be string");
            assert.equal(event, "message", "Invalid event listeneter");
            callHandler = handler;
        };

        var myBroker = new toTest(config, logger, id);
        mqtt.createClient = function (port, host ) {
            assert.lengthOf(arguments, 2, "Missing Argument for Secure Connection");
            assert.equal(port, config.port, "The port has override");
            assert.equal(host, config.host, "The host has override");
            client.connected = true;
            return client;
        };
        var topicPattern = 'dev/+/act' ;
        var topicHandler = function(topic, message) {
            assert.equal(topic, realTopic, "The topis is not the expected");
            assert.deepEqual(message, msg, "The message is missing");
            done();
        };
        client.subscribe = function (vtopic, cb) {
            var granted = [{ topic: vtopic}];
            cb(null, granted);
        };
        myBroker.connect(function(err) {
            assert.isNull(err, "None error shall returned");
            myBroker.bind(topicPattern, topicHandler);
            callHandler("dev/"+id+"/act", JSON.stringify(msg));
            //myBroker.onMessage(realTopic, msg);
        });
    });
    it('Shall Listen to on Message > discard improper message format >', function (done) {
        toTest.__set__("mqtt", mqtt);
        var config = {
                host: "myHosttest",
                port: 9090909,
                secure: false,
                retries: 2
            },
            id = "0a-03-12-22";
        var realTopic = 'dev/' + id + '/act';
        var callHandler = null;
        client.on = function (event, handler) {
            assert.isFunction(handler, "The handle shall be a function");
            assert.isString(event, "The event shall be string");
            assert.equal(event, "message", "Invalid event listeneter");
            callHandler = handler;
        };

        var myBroker = new toTest(config, logger, id);
        mqtt.createClient = function (port, host ) {
            assert.lengthOf(arguments, 2, "Missing Argument for Secure Connection");
            assert.equal(port, config.port, "The port has override");
            assert.equal(host, config.host, "The host has override");
            client.connected = true;
            return client;
        };
        var topicPattern = 'dev/+/act' ;
        var topicHandler = function(topic, message) {
            assert.isFalse(topic, "Wrong path, the messaga shall be discarded");

        };
        client.subscribe = function (vtopic, cb) {
            var granted = [{ topic: vtopic}];
            cb(null, granted);
        };
        myBroker.connect(function(err) {
            assert.isNull(err, "None error shall returned");
            myBroker.bind(topicPattern, topicHandler);
            callHandler("dev/"+id+"/act", "pepep");
            //myBroker.onMessage(realTopic, msg);
            done();
        });
    });
});
