# iotkit-agent

> Note, the agent will be undergoing some modification in preparation for upcoming event. The tag [`0.7.0`](https://github.com/enableiot/iotkit-agent/commit/af2de259530d04585fdf49f8aef471fee3899c93) is the last stable version.

Edge agent to abstract cloud connectivity complexities. It allows edge developers to focus on writing their experiments and interacting with I/O parameters. When sending data to the cloud, the message formatting and security is implemented in the agent so only the message payload has to be provided.   

![Agent Topology](../master/images/agent-topo.png?raw=true)

## Deployment

> This portion of the read me is only required for the initial deployment of the `iotkit-agent`. In many the SD card provided with your board will already come configured with this agent, in which case you can move on to the Usage portion of this read me.

### Installation

In the iotkit-agent directory run:

    ./setup-agent.sh
    
### Configuration

The `iotkit-agent`, by default, has sufficient defaults to register itself in the Cloud. To send data to the Cloud however, the `iotkit-agent` requires modification of two arguments: Username and Password. To define these values, simple rename the sample configuration file included with the agent:

    cp ./config-sample.json ./config.json

And change the default `username` and `password` values:

    {
      username: 'newdevice',
      password: 'iotkit'
    }
    
> You can also change other values in the sample config, but, unless you are sure you know what they mean, these are best left unchanged.
        
### Start

To start the agent service simply execute the `start-agent.sh` file:

    ./start-agent.sh
    
### Stop

    ./stop-agent.sh

## Usage

For instructions how to use the `iotkit-agent` please the [iotkit-samples repo](https://github.com/enableiot/iotkit-samples).
