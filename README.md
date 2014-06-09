# iotkit-agent

The IoT Kit Agent abstracts complexities of Cloud connectivity. It allows developers to focus on application development and logic for their devices (sensors, actuators and tags). IoT Kit Agent transparently implements the necessary message format and security during both the device registration and data submission. 

![Agent Topology](../master/images/agent-topo.png?raw=true)


## Before start using iotkit-agent

The following steps will guide you through the installation and configuration of the iotkit-agent if you download it from this GitHub repository.

In case you get a Galileo board with the iotkit-agent pre-installed, please go to the section **Galileo with iotkit-agent pre-installed**.

## Installation

Install using npm:

    npm install iotkit-agent --production 
    mv node_modules/iotkit-agent ./
    
Once you have a copy of the iotkit-agent locally, you will need to install forever:

    cd iotkit-agent
    npm install forever
    
> You only have to run the setup once
    
### Configuring and Activating the Agent

The iotkit-agent, require to be register at [iotkit-dashboard](https://dashboard.enableiot.com).
To be able to register in iotkit-dashbord, it is required to use the Device ID.
You can obtain the Device ID executing this command:

    ./iotkit-admin.js device-id

Or, you can set a different Device ID with this command:

    ./iotkit-admin.js set-device-id <device_id>

After the registration, copy the activation code
and execute:

    ./iotkit-admin.js activate <activation_code>     

        
### Starting the Agent

To start the iotkit-agent service simply execute the start script:

    ./start-agent.sh
    
### Stop

Yes, you guessed it, run the stop script:

    ./stop-agent.sh

## Usage

For instructions how to use the iotkit-agent please see the [iotkit-samples repo](https://github.com/enableiot/iotkit-samples).

## Test

The iotkit-agent project uses [gruntjs](http://gruntjs.com/) [mocha](http://visionmedia.github.io/mocha/) as its test framework. To run all tests:

> Install all dev-dependences, running:

    npm install 
    cd node_modules/.bin
    grunt

## Notes about "admin" commands

> ./iotkit-admin.js -h

or

> ./iotkit-admin.js

  Usage: iotkit-admin [options] [command]

Commands:

    test                   Tries to reach the server (using the current protocol).
    activate <activation_code> Activates the device.
    register <comp_name> <catalogid> Registers a component in the device.
    reset-components       Clears the component list.
    observation <comp_name> <value> Sends an observation for the device, for the specific component.
    catalog                Displays the Catalog from the device's account.
    components             Displays components registered for this device.
    initialize             Resets both the token and the component's list.
    protocol <protocol>    Set the protocol to 'mqtt' or 'rest'
    host <host> [<port>]   Sets the cloud hostname for the current protocol.
    device-id              Displays the device id.
    set-device-id <id>     Overrides the device id.
    clear-device-id        Reverts to using the default device id.
    save-code <activation_code> Adds the activation code to the device.
    reset-code             Clears the activation code of the device.
    proxy <host> <port>    Sets proxy For REST protocol.
    reset-proxy            Clears proxy For REST protocol.
    set-logger-level <level> Set the logger level to 'debug', 'info', 'warn', 'error'

Options:

    -h, --help     output usage information
    -V, --version  output the version number


## Galileo with iotkit-agent pre-installed

In case you get a Galileo board with the iotkit-agent pre-installed, skip the **Installation** step.
You will need to stop the iotkit-agent and then configure it.
In order to do that, run the command:

    systemctl stop iotkit-agent

Once the iotkit-agent is stopped, you can go to step **Configuring and Activating the Agent**.
**Note**: to run the 'admin' commands, run:
 
    iotkit-admin <command>

This command shall be run from the directory where iotkit-agent is installed.
 
After you configure the agent, you will need to start it with the following command:

    systemctl start iotkit-agent


## Certificates

> Do not use the default certificates in production

The IoT Kit Agent includes default certificates to provide "out of the box" connectivity. These are fine for public data submissions but should not be used for production deployments. 


## License

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
