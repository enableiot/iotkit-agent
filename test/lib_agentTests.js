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


process.env.NODE_ENV = 'test';
var assert = require('assert'),
    utils = require("../lib/utils").init(),
    logger = require("../lib/logger").init(utils),
    configurator = require('../admin/configurator');;

describe('iotkit-agent', function() {
     it('should generate a valid device Id', function(done) {
        utils.getDeviceId(function(id){
            assert(id, 'id is null');
            this.deviceId = id;
            console.log(id);
            done();
        });
    });

});

describe('iotkit-agent', function() {
    it('should generate a valid gatewayId', function(done) {
        configurator.getGatewayId(function(id){
            assert(id, 'id is null');
            assert.notEqual(id, '');
            this.gatewayId = id;
            done();
        });
    });
});

describe('iotkit-agent', function() {
    it('should set a correct gatewayId', function(done) {
        configurator.getGatewayId(function(id) {
            assert(id, 'id is null');
            this.gatewayId = id;
        });

        configurator.setGetewayId('test', function(id){
            assert(id, 'id is null');
            assert.equal(id, 'test');
            //Revert changes made by previous setGateway
            configurator.setGetewayId(this.gatewayId, function(id){
                assert.equal(id, this.gatewayId);
            });
            done();
        });
    });
});


