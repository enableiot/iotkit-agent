/*
Copyright (c) 2014, Intel Corporation

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

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


var fileToTest = "../api/mqtt/connector";

describe(fileToTest, function() {
    var toTest = rewire(fileToTest);

    var mqtt = {
        createSecureClient : function() {},
        createClient : function() {},
        MqttClient: function () {
            this.subscribe = {};
            this.publish = {};
            this.on = function() {};
        }
    };
    var logger  = {
        info : function() {},
        error : function() {},
        debug : function() {}
    };

    var errorHandler = ('Connection Error', function() {
        return this;
    });

    console.debug = function() {
        console.log(arguments);
    };
    beforeEach(function (done) {
        toTest.__set__("broker", null);
        done();
    });
    it('Shall Connect to Specific Broker using None Secure Connection >', function(done) {
        toTest.__set__("mqtt", mqtt);

        var config = {
                host: "myHosttest",
                port: 9090909,
                secure: false,
                retries: 2
            },
            id = "0a-03-12-22";

        var myBroker = toTest.singleton(config, logger);

        var client = new mqtt.MqttClient();
        mqtt.createClient = function (port, host ) {
            assert.lengthOf(arguments, 3, "Missing Argument for Secure Connection");
            assert.equal(port, config.port, "The port has override");
            assert.equal(host, config.host, "The host has override");

            client.connected = true;
            return client;
        };

        client.on = errorHandler;

        myBroker.connect(function(err) {
            assert.isNull(err, "None error shall returned");
            done();
        });
    });
    it('Shall Connect to Specific Broker using Secure Connection >', function(done) {
        toTest.__set__("mqtt", mqtt);
        var config = {
                host: "myHosttest",
                port: 9090909,
                secure: true,
                retries: 2
            },
            id = "0a-03-12-22";
        var myBroker = toTest.singleton(config, logger);
        var client = new mqtt.MqttClient();
        mqtt.createSecureClient = function (port, host, args ) {
            assert.lengthOf(arguments, 3, "Missing Argument for Secure Connection");
            assert.equal(port, config.port, "The port has override");
            assert.equal(host, config.host, "The host has override");

            client.connected = true;
            return client;
        };

        client.on = errorHandler;

        myBroker.connect(function(err) {
            assert.isNull(err, "Not Spected error Returned");
            done();
        });
    });
    it('Shall Catch a Exception at Connect >', function(done) {
        toTest.__set__("mqtt", mqtt);
        var config = {
                host: "myHosttest",
                port: 9090909,
                secure: true,
                retries: 2
            },
            id = "0a-03-12-22";
        var myBroker = toTest.singleton(config, logger);
        var client = new mqtt.MqttClient();
        mqtt.createSecureClient = function (port, host, args ) {
            client.connected = false;
            throw new Error("Invalid Command");
        };

        myBroker.connect(function(err) {
            assert.instanceOf(err, Error, "Shallbe an error Returned");
            done();
        });
    });
    it('Shall Retries to Connect to Specific Broker >', function(done) {
        toTest.__set__("mqtt", mqtt);

        var config = {
                host: "myHosttest",
                port: 9090909,
                secure: true,
                retries: 5
            },
            id = "0a-03-12-22";

        var myBroker = toTest.singleton(config, logger);
        var client = new mqtt.MqttClient();

        mqtt.createSecureClient = function (port, host, args ) {
            assert.lengthOf(arguments, 3, "Missing Argument for Secure Connection");
            assert.equal(port, config.port, "The port has override");
            assert.equal(host, config.host, "The host has override");
            client.connected = false;
            return client;
        };

        client.on = errorHandler;

        myBroker.connect(function(err) {
            assert.isNull(err, "None error shall be returned");
            done();
        });

        setTimeout(function() {
            client.connected = true;
        }, 1000);
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
        };
        var crd = {
            username: "TuUser",
            password: "tuPassword"
        };
        var client = new mqtt.MqttClient();
        mqtt.createSecureClient = function (port, host, args ) {
            assert.lengthOf(arguments, 3, "Missing Argument for Secure Connection");
            assert.equal(port, config.port, "The port has override");
            assert.equal(host, config.host, "The host has override");
            assert.equal(args.username, crd.username, "The user was override");
            assert.equal(args.password, crd.password, "The user was override");
            client.connected = true;
            return client;
        };

        client.on = errorHandler;

        var myBroker = toTest.singleton(config, logger);
        myBroker.setCredential(crd);
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
        var myBroker = toTest.singleton(config, logger);
        var client = new mqtt.MqttClient();
        mqtt.createClient = function (port, host ) {
            assert.lengthOf(arguments, 3, "Missing Argument for Secure Connection");
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

        client.on = errorHandler;

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
        var myBroker = toTest.singleton(config, logger);
        var client = new mqtt.MqttClient();
        var callHandler = null;
        client.on = function (event, handler) {
            if(event === "error") {
                return client;
            }
            assert.isFunction(handler, "The handle shall be a function");
            assert.isString(event, "The event shall be string");
            assert.include(["message", "connect", "close", "error"], event, "Invalid event listeneter");

            if(event === "message") {
                callHandler = handler;
            }

            console.log(event);
        };

        mqtt.createClient = function (port, host ) {
            assert.lengthOf(arguments, 3, "Missing Argument for Secure Connection");
            assert.equal(port, config.port, "The port has override");
            assert.equal(host, config.host, "The host has override");
            client.connected = true;
            return client;
        };

        myBroker.connect(function(err) {
            assert.isNull(err, "None error shall returned");
            callHandler("connector", JSON.stringify(msg));
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
        var client = new mqtt.MqttClient();
        client.on = function (event, handler) {
            if(event === "error") {
                return client;
            }
            assert.isFunction(handler, "The handle shall be a function");
            assert.isString(event, "The event shall be string");
            assert.include(["message", "connect", "close"], event, "Invalid event listener");
            if(event === "message") {
                callHandler = handler;
            }
        };

        var myBroker = toTest.singleton(config, logger);

        mqtt.createClient = function (port, host ) {
            assert.lengthOf(arguments, 3, "Missing Argument for Secure Connection");
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
        var client = new mqtt.MqttClient();
        client.on = function (event, handler) {
            if(event === "error") {
                return client;
            }
            assert.isFunction(handler, "The handle shall be a function");
            assert.isString(event, "The event shall be string");
            assert.include(["message", "connect", "close"], event, "Invalid event listeneter");
            if(event === "message") {
                callHandler = handler;
            }
        };
        var crd = {
            username: "TuUser",
            password: "tuPassword"
        };
        var myBroker = toTest.singleton(config, logger);
        mqtt.createClient = function (port, host, credencial ) {
            assert.lengthOf(arguments, 3, "Missing Argument for Secure Connection");
            assert.equal(port, config.port, "The port has override");
            assert.equal(host, config.host, "The host has override");
            assert.equal(credencial.username, crd.username, "The user was override");
            assert.equal(credencial.password, crd.password, "The user was override");
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
        myBroker.setCredential(crd);
        myBroker.connect(function(err) {
            assert.isNull(err, "None error shall returned");
            myBroker.bind(topicPattern, topicHandler);
            callHandler("dev/"+id+"/act", "pepep");
            //myBroker.onMessage(realTopic, msg);
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
        var client = new mqtt.MqttClient();
        client.on = function (event, handler) {
            if(event === "error") {
                return client;
            }
            assert.isFunction(handler, "The handle shall be a function");
            assert.isString(event, "The event shall be string");
            assert.include(["message", "connect", "close"], event, "Invalid event listeneter");
            if(event === "message") {
                callHandler = handler;
            }
        };

        var myBroker = toTest.singleton(config, logger);

        mqtt.createClient = function (port, host ) {
            assert.lengthOf(arguments, 3, "Missing Argument for Secure Connection");
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
            myBroker.bind(topicPattern, topicHandler, function() {
                callHandler("dev/"+id+"/act", JSON.stringify(msg));
            });
        });
    });
    it('Shall Disconnect from Broker>', function(done) {
        toTest.__set__("mqtt", mqtt);
        var config = {
            host: "myHosttest",
            port: 9090909,
            secure: false,
            retries: 2
        };
        var myBroker = toTest.singleton(config, logger);
        var client = new mqtt.MqttClient();
        mqtt.createClient = function (port, host ) {
            assert.lengthOf(arguments, 3, "Missing Argument for Secure Connection");
            assert.equal(port, config.port, "The port has override");
            assert.equal(host, config.host, "The host has override");
            client.connected = true;
            return client;
        };

        client.on = ('Connection Error', function () {
            return client;
        });

        client.end = function () {
            done();
        };
        myBroker.connect(function(err) {
            assert.isNull(err, "None error shall returned");
            myBroker.disconnect();
        });
    });
});
