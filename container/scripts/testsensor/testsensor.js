#!/usr/bin/env node
// dummy sensor sending random values
// defined by environment
// TEST_SAMPLES: if set number of samples to send before terminating
// COMPONENT_TYPE: name of the component type
// COMPONENT_NAME: name of the component
"use strict";
var dgram = require('dgram');

var PORT = 41234;
var HOST = '127.0.0.1';
var tempValue = 20;
var componentType = "temperature.v1.0";
var componentName = "temp";
var testSamples;
var numSamples = 0;

if (process.env.TEST_SAMPLES) {
    testSamples = process.env.TEST_SAMPLES;
}
if (process.env.COMPONENT_TYPE) {
    componentType = process.env.COMPONENT_TYPE;
}
if (process.env.COMPONENT_NAME) {
    componentName = process.env.COMPONENT_NAME;
}



var registerComponent = function(componentType, name) {
    var component = { "t": componentType, "n": name }
    var comp_message = new Buffer(JSON.stringify(component));
    var client = dgram.createSocket('udp4');
    client.send(comp_message, 0, comp_message.length, PORT, HOST, function(err, response) {
        if (err) console.log("Error:", err);
        client.close();
        console.log("registering " + JSON.stringify(component));
    });
}

var sendObservation = function(data, cb) {
    var message = new Buffer(JSON.stringify(data));

    var client = dgram.createSocket('udp4');
    client.send(message, 0, message.length, PORT, HOST, function(err, response) {
        cb && cb(err, response);
        client.close();
    });
}

var getRandomInteger = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//first register the temp component
setTimeout(
function() {registerComponent(componentType, componentName)}, 5000);

setTimeout(
function(){ setInterval(function() {
    //to be on the save side re-register. Agent will realize if already existing
    registerComponent(componentType, componentName);
    var telemetry = { "n": componentName, "v": tempValue };
    sendObservation(telemetry, function(err, bytes) {
        if (err) console.log("Error:", err);
        console.log(telemetry)
        var change = getRandomInteger(100, -100)
        tempValue += change / 100.0
        numSamples++;
        if (testSamples && numSamples >= testSamples) {
            console.log("Maximal number of testsamples reached. Terminating!")
            process.exit(0);
        }
    })
}, 5 * 1000)}, 10000)
