process.env.NODE_ENV = 'test';

var assert = require('assert'),
    utils = require("../lib/utils").init(),
	 logger = require("../lib/logger").init(utils);

describe('iotkit-agent', function() {

   before(function() {
     this.conf = utils.getConfig();
   });

   beforeEach(function(done){
	  done();
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

   it('should create a valid sensor store', function(done){
   	var me = this;
    	var store = require("../lib/sensors-store");
          store.init(logger);
    	var list = store.getSensorsList();
    	assert(list, 'sensors list is null');
		this.sensors = list;
      done();
   });

   it('should create a valid Cloud connector', function(done){
   	var me = this;
    	var cloud = require("../lib/cloud").init(
    		me.conf, logger, me.deviceId, me.sensors);
    	assert(cloud, 'cloud connector is null');
		this.cloud = cloud;
      done();
   });

   /*
   missing logger
   it('should connect to the Cloud with or without sensors', function(done){
   	var me = this;
    	me.cloud.reg(me.sensors);
      done();
   });
   */

   it('should expose REST listener');
   it('should expose MQTT listener');
   it('should expose UDP listener');
   it('should expose TCP listener');

   it('should persist sensor registration');
   it('should allow for multiple sensor registration');

   after(function(done) {
     // cleanup any temp test resources
     done();
   });

});