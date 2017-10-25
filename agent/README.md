# OISP Agent

This project includes two programs:

### oisp-admin
This is a command line "wrapper" for the [REST API](https://github.com/enableiot/iotkit-api/wiki/Api-Home), enabling you to test connectivity, activate a device, register time series and send observations all from the command line.

### oisp-agent
This is a "agent" program intended to run as a services. You can send a very simple message, such as:

```
{"n": "temp", "v": 26.9}
```

to a UDP socket on port 41234. The agent will add the security token, add a time stamp, convert "temp" to the component (time series) ID, and send a POST over SSL to the cloud server. 

We have an [Arduino library](https://github.com/enableiot/iotkit-samples/tree/master/arduino) which can send this message to the agent, and you can write your own in other languages.

## Installing using git
If the program is not installed, you can install it following these steps:

```
# git clone https://github.com/enableiot/iotkit-agent.git
# cd iotkit-agent/agent
# npm install
# ./oisp-agent.js test
```

## Installing using npm

Follow these steps to install the oisp-agent using in a Linux environment using npm.

To install the oisp-agent using npm, just run:

    npm install oisp-agent
  
#### Testing the connection with OISP

Run the following command to test the connection: 

    ./oisp-admin.js test

*Note*: For more information about oisp-admin commands, go to section [Notes about "admin" commands](#6-notes-about-admin-commands).

#### Configuring and Activating the Agent

Set a unique Device Id with this command:

    ./oisp-admin.js set-device-id <device_id>

You can also set a different Device name with this command:

    ./oisp-admin.js set-device-name <device_name>

After the device registration, copy the activation code in _My Account_ UI, tab _Details_ (in _Account_ menu) and execute the activation command:

    ./oisp-admin.js activate <activation_code>     

To verify activation, go back to your OISP dashboard and verify the status of the device previously registered.

#### Starting the Agent

To start the oisp-agent service simply execute the start script:

    ./oisp-agent.js

## Usage

For instructions how to use the oisp-agent please see the [iotkit-samples repo](https://github.com/enableiot/iotkit-samples).

## Test

The oisp-agent project uses [gruntjs](http://gruntjs.com/) [mocha](http://visionmedia.github.io/mocha/) as its test framework. 
To run all tests:

> Install all dev-dependencies, running:

    npm install 
    node_modules/.bin/grunt

## Notes about "admin" commands

The oisp-agent provides a set of commands (and basic options) to perform configuration over the device, as well as, some basic actions, like activation, initialization, etc.

The following is the list of commands and options:

Commands:

* `test`                                Tries to reach the server (using the current protocol).
* `activate <activation_code>`          Activates the device.
* `register <comp_name> <catalogid>`    Registers a component in the device.
* `reset-components`                    Clears the component list.
* `observation <comp_name> <value>`     Sends an observation for the device, for the specific component.
* `catalog`                             Displays the Catalog from the device's account.
* `components`                          Displays components registered for this device.
* `initialize`                          Resets both the token and the component's list.
* `update`                              Send update device request to dashboard
* `protocol <protocol>`                 Set the protocol to 'mqtt' or 'rest'
* `host <host> [<port>]`                Sets the cloud hostname for the current protocol.
* `device-id`                           Displays the device id.
* `set-device-id <id>`                  Overrides the device id.
* `clear-device-id`                     Reverts to using the default device id.
* `save-code <activation_code>`         Adds the activation code to the device.
* `reset-code`                          Clears the activation code of the device.
* `proxy <host> <port>`                 Sets proxy For REST protocol.
* `reset-proxy`                         Clears proxy For REST protocol.
* `set-logger-level <level>`            Set the logger level to 'debug', 'info', 'warn', 'error'
* `set-data-directory <path>`           Sets path of directory that contains sensor data.
* `reset-data-directory`                Resets to default the path of directory that contains sensor data.
* `move-data-directory <path>`          Change directory where data will be stored
* `gateway-id                           Displays the geteway id.
* `set-gateway-id <id>                  Overrides the geteway id.
* `set-device-name <name>               Change device name
* `reset-device-name                    Resets to default device name.
* `set-udp-port <udp_port>              Overrides the port UDP listener binds to

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -C, --config [path]  Set the config file path


## General notes

* The oisp-agent default protocol is **REST**. To change it to MQTT, use command 'protocol'.
* The 'catalog' command shows the list of components associated with the account where the device is active.
* In order to define the **host**, you don't need to specify the protocol (https/http).

## Certificates

> Do not use the default certificates in production.

The OISP Agent includes default certificates to provide "out of the box" connectivity. These are fine for public data submissions but should not be used for production deployments.

## Using Docker

### Build the image
````bash
make
````

### Start container (connect to production server)
````bash
make start
````

### Start container (connect to local server)
````bash
make start-local
````

### Stop container
````bash
make stop
````

### Remove container and image 
````bash
make clean
````
#### Known limitations
 
* You will need to switch to MQTT protocol to exercise the Actuation functionality.
* Components registered through the OISP Cloud API will not be known by the oisp-agent.

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
