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

If you are participating in a Intel-sponsored hackathon, the agent may be pre-installed on your Galileo or Edison. Try opening a shell on the board and running:

```
# iotkit-admin test
```

## Installing using git
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

You can also set a different Device name with this command:

    ./iotkit-admin.js set-device-name <device_name>

Or a different Gateway Id with this command:

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

##3. Upgrade

If you have pre-installed version of iotkit-agent on your Edison board:
 1. systemctl stop iotkit-agent
 2. Backup old agent located in /usr/lib/node_modules/iotkit-agent where you like
 3. If your agent used global config files, backup external files:

  * /etc/iotkit-agent/config.json
  * /usr/share/iotkit-agent/certs
  * /usr/share/iotkit-agent/data

 4. If it was local installation these folders and files are stored locally in config/ certs/ and data/ folders. Backup them.
 5. Upgrade iotkit-agent using npm
  npm install --global iotkit-agent
 6. Iotkit-agents from v.1.6.0 use three configuration files:

  * global.json - contains default settings
  * device.json - contains device settings such as device_token, account_id, sensor_list.
  * user.js - (optional) allowing user to override any setting in global - like in example file.

  ####If you upgrade from previous versions:
  
 7. Execute node migration.js FOLDER_WITH BACKED_UP_FILES which will compound data from old token.json, sensor-list.json and config.json to device.json.
 8. Use user.js example file to create your own settings, such as proxy, default_connector etc.
 9. Use set-data-directory to provide location of your device.json and user.js

If your iotkit-agent was installed using git:
 1. systemctl stop iotkit-agent
 2. Backup old agent located in /usr/lib/node_modules/iotkit-agent where you like
 3. If your agent used global config files, backup external files:
 
  * /etc/iotkit-agent/config.json
  * /usr/share/iotkit-agent/certs
  * /usr/share/iotkit-agent/data
    
 4. If it was local installation these folders and files are stored locally in config/ certs/ and data/ folders. Backup them.
 5. Upgrade iotkit-agent using git
  From installation directory execute:
  
  * git stash
  * git pull
  * git stash pop
    
  Merge conflicts if occured.
 6. Iotkit-agents from v.1.6.0 use three configuration files:

  * global.json - contains default settings
  * device.json - contains device settings such as device_token, account_id, sensor_list.
  * user.js - (optional) allowing user to override any setting in global - like in example file.
  
  ####If you upgrade from previous versions:

 7. Execute node migration.js FOLDER_WITH BACKED_UP_FILES which will compound data from old token.json, sensor-list.json and config.json to device.json.
 8. Use user.js example file to create your own settings, such as proxy, default_connector etc.
 9. Use set-data-directory to provide location of your device.json and user.js
 
 ####Eventually:
 10. systemctl start iotkit-agent
 11. Check logs in /tmp/agent.log
	
##4. Usage

For instructions how to use the iotkit-agent please see the [iotkit-samples repo](https://github.com/enableiot/iotkit-samples).

##5. Test

The iotkit-agent project uses [gruntjs](http://gruntjs.com/) [mocha](http://visionmedia.github.io/mocha/) as its test framework. 
To run all tests:

> Install all dev-dependencies, running:

    npm install 
    node_modules/.bin/grunt

##6. Notes about "admin" commands

The iotkit-agent provides a set of commands (and basic options) to perform configuration over the device, as well as, some basic actions, like activation, initialization, etc.

If you run them from a **Galileo with a pre-installed agent**, just run `iotkit-admin`.

On the other hand, if you are installing the iotkit-agent using npm, run `./iotkit-admin.js`. 

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


##7. General notes

* The iotkit-agent default protocol is **REST**. To change it to MQTT, use command 'protocol'.
* The device id is obtained from the MAC Address of the Galileo. Get it with the command 'device-id'.
* The 'catalog' command shows the list of components associated with the account where the device is active.
* In order to define the **host**, you don't need to specify the protocol (https/http).

##8. Actuator Request Processing
Components can be configured to be controlled from the cloud. Actuator requests to these devices are generated using either the [iotkit-dashboard](https://dashboard.us.enableiot.com) or the [REST API](https://github.com/enableiot/iotkit-api/wiki/Control-Device-API). These actuation requests are sent to the device via MQTT protocol so the agent must be configured to uses the MQTT protocol. The agent processes incoming actuation requests, reformats them as JSON messages and sends them to local UDP port 41235. This port is configurable. The user must provide the software to listen to this port, handle requests and perform the desired action based on the parameter value (turn LED on/off, set motor speed, etc.) Example scripts can be found in the [iotkit-samples repo](https://github.com/enableiot/iotkit-samples).

Below is an example of the processed JSON message sent to local UDP port 41235 by the agent.
```javascript
{
	"component": "led1",
	"command": "LED.v1.0",
	"argv": [{
		"name": "LED",
		"value": "1"
	}]
}
```
In this example, the request is for component "led1". The "command" field, "LED.v1.0", is a string that was defined in the component type for this component and may or may not have significance to the user. The "LED" parameter name and value can be used to determine what pins to turn on/off.

**Note:** Actuation support requires iotkit-agent version 1.5.2 or later.

##9. Certificates

> Do not use the default certificates in production.

The IoT Kit Agent includes default certificates to provide "out of the box" connectivity. These are fine for public data submissions but should not be used for production deployments. 

## What's new in version 1.6.1
DP-3463 – Added script for migration from iotkit-agent versions 1.5.6 and below.

## What's new in version 1.6.0
DP-3122 – Change config loading strategy
* We introduce new config strategy in this release. Three different configuration files are used: global, user and device. Global config is managed by developers of iotkit-agent. Device config contains all information connected with activated device. User config can be edited manually by user or by iotkit-admin commands. Setting from user configuration file will override the ones from global configuration file.

DP-3115 – Agent should have --config parameter to provide configuration file location
* Agent can be run with parameter to specify folder where user config file is placed. Other configurations are taken from configs in data folder (which can be moved to other location).

DP-2775 – Create agent command that sets UDP port & address for receiving actuations
* UDP port and address can be set using iotkit-admin commands.

DP-3182 – Add command to move data directory with user config
* User can move device and user configuration files to different directory, outside agent folder.

DP-3265 – Add command to set device name using iotkit-admin
* Added command to set device name, not only ID.

DP-3433 – Prepare example user config
* Example user config is provided to help users interact with configuration file syntax and available settings.
 
DP-3282 – Make agent reconnect to MQTT
* Agent try to reconnect to MQTT broker if connection is dropped or lost.
 
DP-2558 – iotkit-agent (and -admin) change the device-id with another MAC
* Device id is set after activation even if it did not have value before activation.

DP-2961 – Agent accepts remote UDP messages
* Agent no longer accept UDP messages from remote machines. It listens for observations only locally.

DP-3309 – Agent should send empty strings as credentials if no credentials provided
* If device is not activated, it sends empty strings as credentials which allow test and activate calls.

DP-3310 – Device is not sending device ID and token
* Available credentials are used in every call, in both REST and MQTT.

DP-3181 – Agent should not require existence of empty or default configuration files.
* There are no longer empty configuration files with token and sensor lists which existence was required.

DP-2970 – iotkit-admin crashes if observation command does not provide enough arguments
* Added additional checking for required arguments before use.



## What's new in version 1.5.4
DP-3127 Using only local configuration files, not system ones.

## What's new in version 1.5.2
DP-2199 – Unable to send observations with value lower than 0
*    Negative values can be send using command line.

DP-2208 – iotkit-admin.js does not work on Windows
*    Correct system temporary folder is used in Windows and Linux operating systems.

DP-2282 – Add commands to agent to modify gateway id
*    Gateway id can be updated separately using command set-gateway-id.

DP-2344 – Timeouts and connection attempts
*    Time limits for MQTT were increased and number of retries lowered.

DP-2351 – When registering a component with short (<4 characters) name, component is not saved and no error is displayed
*    Added validation on client side for too short component name during registration.

DP-2521 – Investigate actuation fails
*    Some problems were found and fixed.

DP-2652 DP-2657 – Sending measurements should not update device every time 
*    Device is no longer updated when sending observation so less data is sent.
*    It’s updated when activating device, registering components or manually by executing update command.

DP-1642 – Several iotkit-admin commands do not check arguments
*    Added message about next required parameter when not provided.

DP-2969 – Sending data by iotkit-agent with value 0 fails
*    Zero is accepted as measurement value.

DP-3029 – Device activation intermittent failures over REST API
*    Timeout for REST calls was increased.

DP-1977 – mqtt.createSecureClient does not pass key options
*    Strict validation of SSL certificates on dashboard and broker enabled by default.

DP-3106 Script for submitting data to local agent using UDP
*    Script for submitting data to local agent using UDP was added to root folder. It can be used by Windows users who do not have nc program in their OS.

DP-3107 Getting Started guide in pdf has been added
*    Getting Started guide in pdf format is available in root folder.


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
