/*
Copyright (c) 2013, Intel Corporation

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
var cloud;
var logger;

var sampleMetric =  { "s": "temp-sensor", "v": 26.7 };
var sampleReg = { "s": "temp-sensor", "t": "float", "u": "Celsius" };

var messageHandler = function(msg) {
    logger.debug("JSON Message: ", msg);

    if (msg === undefined) {
        logger.error('Invalid message received (empty)');
        return;
    }

    if (msg.v !== undefined) {
        // This is a metric message

        // Validate the input args
        if (msg.s === undefined  || msg.v === undefined) {
            logger.error('Invalid message format. Expected %j got %j', sampleMetric, msg, {});
            return;
        }

        if (cloud.sensorsList[msg.s] === undefined) {
            logger.error('The requested sensor: %s have not been registered.', msg.s);
            return;
        }

        if (cloud.registrationCompleted) {
            cloud.metric(msg);
        } else {
            logger.error('The device registration has not been completed. Discarding message %j', msg, {});
            return;
        }

    } else {
        // This is a registration message

        // Validate the input args
        if (!msg.s) {
            logger.error('Invalid message format. Expected %j got %j', sampleReg, msg, {});
            return;
        }

        cloud.sensorsList[msg.s] = {   units: msg.u || 'number',
            data_type: msg.t || 'float',
            name: msg.s,
            items: 1 };

        cloud.reg();
    }
};

var init = function(loggerObj, cloudObj) {
    logger = loggerObj;
    cloud = cloudObj;
}

module.exports.init = init;
module.exports.messageHandler = messageHandler;
