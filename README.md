# iotkit-agent

The IoT Kit Agent abstracts complexities of Cloud connectivity. It allows developers to focus on application development and logic for their devices (sensors, actuators and tags). IoT Kit Agent transparently implements the necessary message format and security during both the device registration and data submission. 

![Agent Topology](../master/images/agent-topo.png?raw=true)

## Installation

Install using npm:

    npm install iotkit-agent --production
    mv node_modules/iotkit-agent ./
    
Once you have a copy of the iotkit-agent locally, execute the setup script:

    cd iotkit-agent
    ./setup-agent.sh
    
> You only have to run the setup once
    
### Configuration

The iotkit-agent, require to be register at [iotkit-dashboard](https://dashboard.enableiot.com). After, the registration copy the autorization code 
and execute

    node admin activate <activation_code>     

> You can configure deviceId of the iotkit-agent 
        
    node admin setDeviceId <new name>        
        
### Start

To start the iotkit-agent service simply execute the start script:

    ./start-agent.sh
    
### Stop

Yep, you guessed it, run the stop script:

    ./stop-agent.sh

## Usage

For instructions how to use the iotkit-agent please the [iotkit-samples repo](https://github.com/enableiot/iotkit-samples).

## Test

The iotkit-agent project uses [gruntjs](http://gruntjs.com/) [mocha](http://visionmedia.github.io/mocha/) as its test framework. To ran all tests:

> Install all dev-dependence running

    npm install 
    grunt

## Notes about "admin"

<code> node admin savecode [code]</code> - save the activation code – the agent will activate on startup using this code, if the existing token is empty

<code> node admin activate [code]</code> – activate using the activation code, if the existing token is empty and send device metadata to the cloud

<code> node admin resettoken</code> – reset the security token, enabling activation again

<code> node admin device_id</code> - get the current device id – either from the MAC or — if previously set — the ID that was set

<code> node admin setDeviceId [device_id]</code> - set the device_id to be sent (default is the MAC address)

<code> node admin resetDeviceId</code> – reset the device_id override, which will use the MAC


## Certificates

> Do not use the default certificates in production

The IoT Kit Agent includes default certificates to provide "out of the box" connectivity. These are fine for public data submissions but should not be used for production deployments. 


## License

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
