/*
 Copyright (c) 2017, Intel Corporation

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
var assert =  require('chai').assert;
rewire = require('rewire'),
url = require('url');

var GlobalConfig = require('../config');

var fileToTest = "../api/rest/alerts.def.js";

describe(fileToTest, function() {
    var toTest = rewire(fileToTest);
    var logger = {
        info : function() {},
        error : function()  {},
        debug : function() {}
    };
    console.debug = function() {
        return "Bearer" + token;
    };
    function makeTokenBearer (token) {
        return "Bearer " + token;
    };
    it('Shall Return the GetListOfAlertsOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    alerts: {
                        getListOfAlerts: '/v1/api/accounts/{accountId}/alerts/'
                    }
                }
            },

        };
        toTest.__set__('config', config);
        var data = {
            accountId: 20000,
            body: {
                a: 1,
                b: 2,
                c: [1,2,3]
            }
        };

        var deTest = new toTest.GetListOfAlertsOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/alerts/", "path improper formed");
        assert.equal(deTest.body, null);
        assert.equal(deTest.method, "GET", "The verb is incorrect");
        done();
    });
    it('Shall Return the GetAlertDetailsOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    alerts: {
                        getAlertDetails: '/v1/api/accounts/{accountId}/alerts/{alertId}'
                    }
                }
            },

        };
        toTest.__set__('config', config);
        var data = {
            accountId: 20000,
            alertId: 75,
            body: {
                a: 1,
                b: 2,
                c: [1,2,3]
            }
        };

        var deTest = new toTest.GetAlertDetailsOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/alerts/75", "path improper formed");
        assert.equal(deTest.body, null);
        assert.equal(deTest.method, "GET", "The verb is incorrect");
        done();
    });
    it('Shall Return the DeleteAlertOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    alerts: {
                        getAlertDetails: '/v1/api/accounts/{accountId}/alerts/{alertId}'
                    }
                }
            },

        };
        toTest.__set__('config', config);
        var data = {
            accountId: 20000,
            alertId: 75,
            body: {
                a: 1,
                b: 2,
                c: [1,2,3]
            }
        };

        var deTest = new toTest.DeleteAlertOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/alerts/75", "path improper formed");
        assert.equal(deTest.body, null);
        assert.equal(deTest.method, "DELETE", "The verb is incorrect");
        done();
    });
    it('Shall Return the CloseAlertOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    alerts: {
                        closeAlert: '/v1/api/accounts/{accountId}/alerts/{alertId}/reset'
                    }
                }
            },

        };
        toTest.__set__('config', config);
        var data = {
            accountId: 20000,
            alertId: 75,
            body: {
                a: 1,
                b: 2,
                c: [1,2,3]
            }
        };

        var deTest = new toTest.CloseAlertOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/alerts/75/reset", "path improper formed");
        assert.equal(deTest.body, null);
        assert.equal(deTest.method, "PUT", "The verb is incorrect");
        done();
    });
    it('Shall Return the UpdateAlertStatusOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    alerts: {
                        updateAlertStatus: '/v1/api/accounts/{accountId}/alerts/{alertId}/status/{statusName}'
                    }
                }
            },

        };
        toTest.__set__('config', config);
        var data = {
            accountId: 20000,
            alertId: 75,
            statusName: "New",
            body: {
                a: 1,
                b: 2,
                c: [1,2,3]
            }
        };

        var deTest = new toTest.UpdateAlertStatusOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/alerts/75/status/New", "path improper formed");
        assert.equal(deTest.body, null);
        assert.equal(deTest.method, "PUT", "The verb is incorrect");
        done();
    });
    it('Shall Return the AddCommentsToAlertOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    alerts: {
                        addCommentsToAlert: '/v1/api/accounts/{accountId}/alerts/{alertId}/comments'
                    }
                }
            },

        };
        toTest.__set__('config', config);
        var data = {
            accountId: 20000,
            alertId: 75,
            body: {
                a: 1,
                b: 2,
                c: [1,2,3]
            }
        };

        var deTest = new toTest.AddCommentsToAlertOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/alerts/75/comments", "path improper formed");
        assert.equal(deTest.body, JSON.stringify(data.body));
        assert.equal(deTest.method, "POST", "The verb is incorrect");
        done();
    });
});