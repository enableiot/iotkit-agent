#!/usr/bin/env node
// dummy sensor sending random values
// defined by environment
// TEST_SAMPLES: if set number of samples to send before terminating
// COMPONENT_TYPE: name of the component type
// COMPONENT_NAME: name of the component
// LOG_LEVEL: log level
"use strict";
var dgram = require('dgram');
var PD = require('probability-distributions');
var winston = require('winston');
var fs = require('fs');
const specsFileName = '/etc/oisp/sensorSpecs.json';

var logLevel = process.env.LOG_LEVEL;
if (logLevel === undefined) {
    logLevel = 'warn';
}
const logger = winston.createLogger({
    level: logLevel,
    transports: [
	new winston.transports.Console()
    ]
})

var default_port = 41234;
var default_host = '127.0.0.1';
var default_sensorSpecs = [
    {
	agents: [
	    {
		port: default_port,
		host: default_host
	    }
	],
	name: "tempSensor",
	componentName: "temp",
	componentType: "temperature.v1.0",
	type: "number",
  sleep: 5000,
	sigma: 0.3,
	startValue: 20
    }
]

var values = {};
var numSamples = 0;
var testSamples;

var sensorSpecs = [];

if (fs.existsSync(specsFileName)) {
    var jsondata = fs.readFileSync(specsFileName);
    sensorSpecs = JSON.parse(jsondata);
    logger.info("SensorSpec found in /etc/oisp. Loaded: " + JSON.stringify(sensorSpecs));
}
else {
    sensorSpecs = default_sensorSpecs;
    logger.info("SensorSpec NOT found in /etc/oisp. Default: " + JSON.stringify(sensorSpecs));
}

if (process.env.TEST_SAMPLES) {
    testSamples = process.env.TEST_SAMPLES;
}

var registerComponent = function(spec) {
    spec.compRegistering++;
    if (spec.compRegistering > 5) {
      return;
    }
    var component = { "t": spec.componentType, "n": spec.componentName }
    var comp_message = new Buffer(JSON.stringify(component));
    spec.agents.forEach(function(agent){
	var client = dgram.createSocket('udp4');
	logger.verbose("Registring component: " + JSON.stringify(component) + " at url " + agent.host + ":" + agent.port);
	client.send(comp_message, 0, comp_message.length, agent.port, agent.host, function(err, response) {
            if (err) logger.error("Error: " + err);
            client.close();
	});
    });
}

var sendObservation = function(spec, data, cb) {
    var message = new Buffer(JSON.stringify(data));
    spec.agents.forEach(function(agent) {
	var client = dgram.createSocket('udp4');
	client.send(message, 0, message.length, agent.port, agent.host, function(err, response) {
            cb && cb(err, response);
            client.close();
	});
    });
}

var getRandomInteger = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//initialize all values
sensorSpecs.forEach(function(spec) {
    values[spec.name] = spec.startValue;
    spec.compRegistering = 0;
});

//first register the temp component
sensorSpecs.forEach(function(spec) {
    setTimeout(
	function() {registerComponent(spec)}, 5000);
});

sensorSpecs.forEach(function(spec){
    var sleeptime = 5000;
    if (spec.sleep != undefined) {
      sleeptime = spec.sleep;
    }
    setTimeout(
	function(){ setInterval(function() {
	    //to be on the save side re-register. Agent will realize if already existing
	    registerComponent(spec);
	    var value = values[spec.name];
	    if (spec.type === "string") {
		value += Math.round(Math.random() * 100000000);
		}
	    var telemetry = { "n": spec.componentName, "v": value };
	    sendObservation(spec, telemetry, function(err, bytes) {
		if (err) logger.error("Error:" + err);
		logger.info(telemetry)
		if (spec.type === "number") {
		    var change = PD.rnorm(1, 0, spec.sigma);
		    value += change[0];
		    values[spec.name] = value;
		}
		numSamples++;
		if (testSamples && numSamples >= testSamples) {
		    logger.info("Maximal number of testsamples reached. Terminating!")
		    process.exit(0);
		}
	    })
	}, sleeptime)}, 10000)
});
