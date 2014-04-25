process.env.NODE_ENV = 'test';
var assert = require('assert'),
    utils = require("../lib/utils").init(),
    logger = require("../lib/logger").init(utils);

describe('iotkit-agent', function() {
   before(function() {
     this.conf = utils.getConfig();
   });
    it('should generate a valid device Id', function(done){
        var me = this;
        utils.getDeviceId(function(id){
            assert(id, 'id is null');
            this.deviceId = id;
            console.log(id);
            done();
        });
    });

});