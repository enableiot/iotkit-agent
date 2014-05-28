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


'use strict';
var components = require('./components');
var data1 = require('./data4demo');
var request = require('request');

var INTERVAL = 5; //in Seconds

var buildMeasureData = function(comp, measure){
    //var measure = Math.floor(Math.random() * (high - low) + low);
    return {
        "n": comp,
        "v": measure
    };
};

function putRequest(options){
    request(options, function(err, res, body){
        if(!err && res.statusCode === 201 && body !== undefined){
            console.info('Response: ', res.statusCode, " - ",  body);
        } else {
            console.error('Error: ', err);
            console.error('Response: ', res.statusCode);
        }
    });
};
var i = 0;
var total = data1.length;

setInterval(function (){
    var data4demo = data1;

    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    var measure = 0;
    for(var k = 0; k < components.length; k++){
        if(components[k].type.indexOf("temperature") != -1){
            measure = data4demo[i].temp;
        } else {
            measure = data4demo[i].hum;
        }
        var data = buildMeasureData(components[k].comp_name, measure);

        var options = {
            url: 'http://localhost:9090/',
            method: 'PUT',
            headers:{"content-type":"application/json"},
            body: JSON.stringify(data)
        };
        console.log("Data (%s)", i.toString(), data);

        putRequest(options);
    }

    i++;
    if(i == total){
        i = 0;
    }
}, INTERVAL * 1000);



