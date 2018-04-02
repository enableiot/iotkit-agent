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


process.env.NODE_ENV = 'test';
var assert = require('assert'),
    sinon = require('sinon'),
    rewire = require('rewire'),
    fake_common = require('./fakecommon.js'),
    //logger = require("@open-iot-service-platform/oisp-sdk-js").lib.logger.init(utils),
    schemaValidation = require('../lib/schema-validator'),
    configurator_test = rewire("../admin/configurator.js");
var sinonTestFactory = require('sinon-test');
var sinonTest = sinonTestFactory(sinon);

var logger = {
    log: function() {},
    info: function() {},
    error: function() {},
    debug: function() {}
};

var fakepath = {
    join: function() {},
    resolve: function() {}
};

describe('oisp-agent/lib/utils', function() {
    var systemos = require("os");
    var toTest = rewire("../lib/utils.js");
    toTest.__set__("logger", logger);
    toTest.__set__("common", fakeCommon);
    toTest.__set__("config", Testvalue.config);
    var iotkitutils = toTest.__get__("IoTKitUtils");

    it('should get external info', sinonTest(function(done) {
        var res = {
            statusCode: 200,
            setEncoding: function(data) {},
            on: function(data, cb) {
                cb('{"name":"hello"}');
            }
        }
        var httpMock = {
            request: function(opt, cb) {
                cb(res);
                return {
                    end: function() {}
                };
            }
        };
        toTest.__set__("os", fakeos);
        toTest.__set__("http", httpMock);
        iotkitutils.prototype.getExternalInfo(function(data) {
            assert.deepEqual(data, {
                name: 'hello',
                ip_local: '11.22.33.44'
            }, 'err data');
        });
        done();
    }));

    it('should generate device from did', function(done) {
        testdeviceConfig.device_id = '44-55-66-77-88-99';
        var utils = toTest.init();
        utils.getDeviceId(function(id) {
            assert.equal(id, '44-55-66-77-88-99');
            done();
        });
    });

    it('should generate device Id from mac', function(done) {
        var mac = require('getmac');
        var fakemac = {
            getMac: function(cb) {
                cb(null, '99:88:77:66:55:44');
            }
        }
        toTest.__set__("mac", fakemac);
        iotkitutils.prototype.getDeviceId(function(id) {
            assert(id, 'id is null');
            assert.equal(id,'99-88-77-66-55-44');
            done();
        });
    });

    it('should generate a valid IP', function(done) {
        toTest.__set__("os", fakeos);
        var ip = iotkitutils.prototype.getIPs()
        assert.equal(ip, '11.22.33.44');
        toTest.__set__("os", systemos);
        done();
    });

    it('should return agents attribute', function(done) {
        var agentattr = iotkitutils.prototype.getAgentAttr();
        assert(agentattr, 'agents attribute is null');
        //console.log(agentattr);
        done();
    });

    it('should get gate way id', function(done) {
        var utils = toTest.init();
        utils.getGatewayId('thekey', function(data) {
            assert.equal(data, Testvalue.config.thekey, 'error id');
            done();
        })
    });

    it('should get gate way id from device id', function(done) {
        var utils = toTest.init();
        utils.getGatewayId('null', function(data) {
            assert.equal(data, testdeviceConfig.device_id, 'error id');
            done();
        })
    });

    it('should get data directory', function(done) {
        var utils = toTest.init();
        utils.getDataDirectory('thekey', function(data) {
            assert.equal(data, Testvalue.config.thekey, 'error id');
            done();
        })
    });

    it('should get minutes and seconds from miliseconds', function(done) {
        var timestamp = 1234567;
        var correctresult = {
            m: 20,
            s: '35'
        };
        var timeresult = iotkitutils.prototype.getMinutesAndSecondsFromMiliseconds(
            timestamp)
        assert.equal(timeresult.m, correctresult.m,
            'error minutes');
        assert.equal(timeresult.s, correctresult.s,
            'error seconds');
        done();
    });
});

describe('oisp-agent/admin/configurator', function() {
    configurator_test.__set__("common", fakeCommon);
    configurator_test.__set__("logger", logger);

    it('should set the cloud hostname for the current protocol', sinonTest(function(done) {
        var sethostfor = configurator_test.__get__("setHostFor");
        var spy = this.spy(fakeCommon, 'saveToUserConfig');;
        sethostfor("https://127.0.0.1", 80);

        assert.equal(testuserConfig['connector.ws.host'], "https://127.0.0.1");
        assert.equal(testuserConfig['connector.ws.port'], 80);
        assert.equal(spy.callCount, 2);
        Testvalue.config.default_connector = "rest";

        sethostfor("https://127.0.0.1", 80);
        assert.equal(testuserConfig['connector.rest.protocol'], 'https');
        assert.equal(testuserConfig['connector.rest.host'], '127.0.0.1');
        assert.equal(testuserConfig['connector.rest.port'], 80);
        assert.equal(spy.callCount, 5);

        done();
    }));

    it('should set proxy for the current protocol', sinonTest(function(
        done) {
        var setproxy = configurator_test.__get__("setProxy");

        setproxy(6666, 5643.5, function(proxy, err) {
            assert.equal(err, 'Port value must be an integer', 'int err');
        });
        setproxy(6666, 100000, function(proxy, err) {
            assert.equal(err, 'Port value out of valid range', 'range err');
        });
        setproxy(6666, 904, function(proxy, err) {
            assert.equal(testuserConfig['connector.rest.proxy.host'], 6666);
            assert.equal(testuserConfig['connector.rest.proxy.port'], 904);
            assert.equal(testuserConfig['connector.ws.proxy.host'], 6666);
            assert.equal(testuserConfig['connector.ws.proxy.port'], 904);
            assert.equal(err, undefined, 'should be ok');
        });
        done();
    }));

    it('should reset proxy for the current protocol', sinonTest(function(done) {
        var resetproxy = configurator_test.__get__("resetProxy");
        var saveToUserConfigspy = this.spy(fakeCommon, 'saveToUserConfig');
        resetproxy();
        assert.equal(saveToUserConfigspy.callCount, 4, 'called times error');
        done();
    }));

    it('should set and get last actuations pull time', sinonTest(function(done) {
        var setlastactuationspulltime = configurator_test.__get__("setLastActuationsPullTime");
        setlastactuationspulltime('lasttime');
        assert.equal(testdeviceConfig.last_actuations_pull_time, 'lasttime');
        done();
    }));

    it('should set listener udp port', sinonTest(function(done) {
        var setlistenerudpport = configurator_test.__get__("setListenerUdpPort");

        setlistenerudpport(68, function(port, err) {
            assert.equal(err, undefined, 'error exist');
            assert.equal(port, 68);
        });

        var spy = this.spy(fakeCommon, 'saveToUserConfig');
        setlistenerudpport(123.4, function(port, err) {
            assert.equal(err, 'Port value must be an integer', 'should get error');
            assert.equal(spy.callCount, 0, 'saveToUserConfig should not be called');
        });
        done();
    }));

    it('should make data directory if not exist', sinonTest(function(done) {
        var movedatadirectory = configurator_test.__get__("moveDataDirectory");
        var spy = this.spy();
        var localFakeFs = Object.assign({}, fakefs);
        localFakeFs.exists = function(dir, cb) {
            cb(false);
        }
        localFakeFs.mkdir = function(dir, cb) {
            spy();
            cb('cannot make dir');
        }
        localFakeFs.writeFileSync = function(thispath) {
            assert.equal(thispath, "/file/exists/myfile");
        };
        localFakeFs.readFileSync = function(thispath) {
            assert.equal(thispath, "/file/exists/data/myfile");
        };
        localFakeFs.rmdirSync = function(thispath) {
            assert.equal(thispath, "/file/exists");
        };
        localFakeFs.unlinkSync = function(thispath) {
            assert.equal(thispath, "/file/exists/data/myfile");
        };

        configurator_test.__set__("fs", localFakeFs);
        configurator_test.__set__("__dirname", "/file/exists/maybe");

        movedatadirectory("/file/exists", function(data) {
            if (data) {
                assert.equal(data, 'cannot make dir');
            } else {
                assert.equal(data, undefined);
            }
        })
        assert(spy.calledOnce);
        done();
    }));

    it('should move data directory', sinonTest(function(done) {
        var movedatadirectory = configurator_test.__get__("moveDataDirectory");
        var spy = this.spy();
        var spy2 = this.spy();
        var localFakeFs = Object.assign({}, fakefs);
        var localfakecommon = Object.assign({}, fakeCommon);

        localfakecommon.saveToGlobalConfig = function(key, value) {
            assert.equal(key, 'data_directory');
            assert.equal(value, "/file/exists/data");
        };
        localFakeFs.mkdir = function(dir, cb) {
            spy();
            cb('cannot make dir');
        };
        localFakeFs.rmdirSync = function() {
            spy2();
        };
        localFakeFs.writeFileSync = function(thispath) {
            assert.equal(thispath, "/file/exists/myfile");
        };
        localFakeFs.readFileSync = function(thispath) {
            assert.equal(thispath, "/file/exists/data/myfile");
        };
        localFakeFs.unlinkSync = function(thispath) {
            assert.equal(thispath, "/file/exists/data/myfile");
        };
        configurator_test.__set__("__dirname", "/file/exists/maybe");
        configurator_test.__set__("fs", localFakeFs);
        configurator_test.__set__("common", localfakecommon);

        movedatadirectory("/file/exists/data", function(data) {
            assert.equal(data, undefined);
        })
        assert.equal(spy.callCount, 0, 'mkdir should not be called');
        assert.equal(spy2.callCount, 0, 'rmdir should not be called');
        done();
    }));

    it('should generate a valid gatewayId', function(done) {
        var getgatewayid = configurator_test.__get__("getGatewayId");
        getgatewayid(function(id) {
            assert(id, 'id is null');
            assert.notEqual(id, '');
            this.gatewayId = id;
            done();
        });
    });

    it('should set data directory', sinonTest(function(done) {
        var setdatadirectory = configurator_test.__get__("setDataDirectory");
        var localFakeFs = Object.assign({}, fakefs);
        var localfakecommon = Object.assign({}, fakeCommon);
        var spy = this.spy();

        localFakeFs.exists = function(dir, cb) {
            cb(true);
        };

        localfakecommon.saveToGlobalConfig = function(key, value) {
            assert.equal(key, 'data_directory');
            assert.equal(value, "/file/exists/here");
        }
        configurator_test.__set__("fs", localFakeFs);
        configurator_test.__set__("common", localfakecommon);
        setdatadirectory("/file/exists/here", function() {
            spy()
        });
        assert.equal(spy.callCount, 0, 'called times error');
        done();
    }));
});

describe('oisp-agent/lib/schemaValidation', function() {
    it('should success validate', function(done) {
        var result
        var obj = "aaa";
        var schema = {
            "$schema": "http://json-schema.org/draft-03/schema#",
            "pattern": "^a*$"
        };
        assert.deepEqual(schemaValidation.validate(obj, schema), []);
        done();
    });

    it('should fail validate', function(done) {
        var result
        var obj = "bbb";
        var schema = {
            "type": "boolean"
        };
        var wrongmessage = [{
            property: '',
            message: 'string value found, but a boolean is required',
            customMessage: ' string value found, but a boolean is required'
        }];
        //console.log(schemaValidation.validate(obj, schema));
        assert.deepEqual(schemaValidation.validate(obj, schema), wrongmessage, 'not get expected messege');
        done();
    });

    it('should return if validation of data and schema meets errors',
        function(
            done) {
            var result
            var data = 1;
            var schema = {
                "type": "integer"
            };
            assert.equal(schemaValidation.validateSchema(schema)(
                data), true);
            done();
        });

    it('should format a valid error message from errors array',
        function(done) {
            var errors = [{
                customMessage: 'n must be at least 4 characters long'
            }, {
                customMessage: 't is missing'
            }];
            schemaValidation.parseErrors(errors, function(msg) {
                assert(msg, 'msg is null');
                assert.equal(msg,
                    'name must be at least 4 characters long, type is missing'
                );
                done();
            });
        });

    it('should return empty error message from empty array', function(
        done) {
        var errors = [];
        schemaValidation.parseErrors(errors, function(msg) {
            //assert(msg, 'msg is null');
            assert.equal(msg, '');
            done();
        });
    });
});
