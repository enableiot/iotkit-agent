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

The iotkit-agent, by default, has sufficient defaults to register itself in the Cloud.
    
> You can configure many parameters of the iotkit-agent in the config file located in the root folder, but, unless you are sure you know what they mean, these are best left unchanged.
        
### Start

To start the iotkit-agent service simply execute the start script:

    ./start-agent.sh
    
### Stop

Yep, you quest it, run the stop script:

    ./stop-agent.sh

## Usage

For instructions how to use the iotkit-agent please the [iotkit-samples repo](https://github.com/enableiot/iotkit-samples).

## Test

The iotkit-agent project uses [mocha](http://visionmedia.github.io/mocha/) as its test framework. To ran all tests:

    mocha

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
