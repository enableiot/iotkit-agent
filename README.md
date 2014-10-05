# iotkit-agent

This project includes two programs:

###iotkit-admin
This is a command line "wrapper" for the [REST API](https://github.com/enableiot/iotkit-api/wiki/Api-Home), enabling you to test connectivity, activate a device, register time series and send observations all from the command line.

###iotkit-agent
This is a "agent" program intended to run as a services. You can send a very simple message, such as:

```
{"n": "temp", "v": 26.9}
```

to a UDP socket on port 41234. The agent will add the security token, add a time stamp, convert "temp" to the component (time series) ID, and send a POST over SSL to the cloud server. 

We have an [Arduino library](https://github.com/enableiot/iotkit-samples/tree/master/arduino) which can send this message to the agent, and you can write your own in other languages.

## Getting Started

Here is a getting started document which walks you through this material:

[Getting Started Presentation](../master/doc/gettingStarted.pdf)

## Installing

If you are participating in a Intel-sponsored hackathon, the agent may be pre-installed on your Galileo or Edison. Try opening a shell on the board and running:

```
# iotkit-admin test
```

If the program is not installed, you can install it following these steps:

```
# git clone https://github.com/enableiot/iotkit-agent.git
# cd iotkit-agent
# npm install
```

##Which version of the command line?

If the agent has been pre-installed on your Galileo or Edison board, you can run:

```
# iotkit-admin test
```

but if it isn't installed, you will need "cd" to the directory where you installed it and run it from the local directory (note the leading ./ and the trailing .js):

```
# ./iotkit-agent.js test
```

##Setting up you board

###1 Test the connection to the cloud


```
# iotkit-admin test
2014-10-05T22:05:12.055Z - info: Connected to broker.us.enableiot.com
2014-10-05T22:05:12.055Z - info: Environment: PROD
2014-10-05T22:05:12.055Z - info: Build: 0.10.3

```

*Note*: For more information about iotkit-admin commands, go to section [Notes about "admin" commands](#5-notes-about-admin-commands).

####1.3 Configuring the agent  

The iotkit-agent requires to be register at [iotkit-dashboard](https://dashboard.us.enableiot.com).
You will need and id (a.k.a Device Id) to register the Galileo in the iotkit-dashboard. In
To get this Device Id, run the command:

    iotkit-admin device-id
    
> In the Dashboard enter both Id and Gateway as output by previous command.

Or, you can set a different Device Id with this command:

    iotkit-admin set-device-id <device_id>

After the registration in the iotkit-dashboard, copy the **activation code** displayed in the _My Account_ UI, tab _Details_ (in _Account_ menu) and **activate** the device 
by executing:

    iotkit-admin activate <activation_code>

The device should be active system wide. To verify that, go back to your iotkit dashboard and verify the status of the device previously registered. 
        
####1.4 Starting the Agent

Once the device has been activated, the iotkit-agent has to be started. To do that simply execute the start script:

    systemctl start iotkit-agent

##2. Installing using npm

Follow these steps to install the iotkit-agent if you want to try in any Linux environment or if you got a Galileo without the iotkit-agent pre-installed.

To install the iotkit-agent using npm, just run:

    npm install iotkit-agent 
    mv node_modules/iotkit-agent ./
    
Once you have a copy of the iotkit-agent locally, you will need to install **forever**:

    cd iotkit-agent
    npm install forever
  
####2.1 Testing the connection with iotkit-dashboard

Run the following command to find the enableiot dashboard: 

    ./iotkit-admin.js test

*Note*: For more information about iotkit-admin commands, go to section [Notes about "admin" commands](#5-notes-about-admin-commands).

####2.2 Configuring and Activating the Agent

The steps to configure and activate the agent are almost the same as the scenario where the iotkit-agent has been pre-installed in the Galileo.

So, you will need to register the iotkit-agent at the [iotkit-dashboard](https://dashboard.us.enableiot.com).
To do that, you need to obtain the Device Id and Gateway Id by executing those commands :

    ./iotkit-admin.js device-id
    ./iotkit-admin.js gateway-id

> If both Gateway Id and Device Id weren't set in the past, they will have the same value on the beginning.

> In the Dashboard enter both Id and Gateway as output by previous commands.

Or, you can set a different Device Id with this command:

    ./iotkit-admin.js set-device-id <device_id>

You can also set a different Gateway with this command:

    ./iotkit-admin.js set-gateway-id <gateway_id>


Once you get the Device Id and Gateway Id, use them to register the device id in your dashboard.

After the device registration, copy the activation code in _My Account_ UI, tab _Details_ (in _Account_ menu) and execute the activation command:

    ./iotkit-admin.js activate <activation_code>     

The device should be active system wide. 
To verify that, go back to your iotkit dashboard and verify the status of the device previously registered.

####2.3 Starting the Agent

To start the iotkit-agent service simply execute the start script:

    ./start-agent.sh
    
####2.4 Stopping the Agent

Yes, you guessed it, run the stop script:

    ./stop-agent.sh

##3. Usage

For instructions how to use the iotkit-agent please see the [iotkit-samples repo](https://github.com/enableiot/iotkit-samples).

##4. Test

The iotkit-agent project uses [gruntjs](http://gruntjs.com/) [mocha](http://visionmedia.github.io/mocha/) as its test framework. 
To run all tests:

> Install all dev-dependencies, running:

    npm install 
    node_modules/.bin/grunt

##5. Notes about "admin" commands

The iotkit-agent provides a set of commands (and basic options) to perform configuration over the device, as well as, some basic actions, like activation, initialization, etc.

If you run them from a **Galileo with a pre-installed agent**, just run `iotkit-admin`.

On the other hand, if you are installing the iotkit-agent using npm, run `./iotkit-admin.js`. 

The following is the list of commands and options:

Commands:

* `test`                    Tries to reach the server (using the current protocol).
* `activate <activation_code>` Activates the device.
* `register <comp_name> <catalogid>` Registers a component in the device. Use this command just for testing purposes.
* `reset-components`       Clears the component list.
* `observation <comp_name> <value>` Sends an observation for the device, for the specific component. Use this command just for testing purposes.
* `catalog`                Displays the Catalog from the device's account.
* `components`             Displays components registered for this device.
* `initialize`             Resets both the token and the component's list.
* `protocol <protocol>`    Set the protocol to 'mqtt' or 'rest'
* `host <host> [<port>]`   Sets the cloud hostname for the current protocol.
* `device-id`              Displays the device id.
* `set-device-id <id>`     Overrides the device id.
* `clear-device-id`        Reverts to using the default device id.
* `save-code <activation_code>` Adds the activation code to the device.
* `reset-code`             Clears the activation code of the device.
* `proxy <host> <port>`    Sets proxy For REST protocol.
* `reset-proxy`            Clears proxy For REST protocol.
* `set-logger-level <level>` Set the logger level to 'debug', 'info', 'warn', 'error'

Options:

    -h, --help     output usage information
    -V, --version  output the version number

Commands like 'register' and 'observation' should be used only for testing purposes. 

##6. General notes

* The iotkit-agent default protocol is **REST**. To change it to MQTT, use command 'protocol'.
* The device id is obtained from the MAC Address of the Galileo. Get it with the command 'device-id'.
* The 'catalog' command shows the list of components associated with the account where the device is active.
* In order to define the **host**, you don't need to specify the protocol (https/http).

##7. Certificates

> Do not use the default certificates in production.

The IoT Kit Agent includes default certificates to provide "out of the box" connectivity. These are fine for public data submissions but should not be used for production deployments. 

## What's new in version 0.8.5

* Besides MQTT connection, now it's possible to connect with the Iot Kit Cloud through REST protocol.
* MQTT and REST listeners were deprecated in favor of TCP and UDP protocols.
* Added Administrator commands to leverage agent configuration.
* Supports two different type of components: sensors and actuators.   
 
#### Known limitations
 
* You will need to switch to MQTT protocol to exercise the Actuation functionality.
* Components registered through the IotKit Cloud API will not be known by the iotkit-agent.

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
