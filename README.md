# iotkit-agent

Edge agent to abstract cloud connectivity complexities. It allows edge developers to focus on writing their experiments and interacting with I/O parameters. When sending data to the cloud, the message formatting and security is implemented in the agent so only the message payload has to be provided.   

![Agent Topology](../master/images/agent-topo.png?raw=true)

## Deployment

> This portion of the read me is only required for the initial deployment of the `iotkit-agent`. In many the SD card provided with your board will already come configured with this agent, in which case you can move on to the Usage portion of this read me.

### Installation

In the iotkit-agent directory run:

    npm install
    
### Configuration

The `iotkit-agent`, by default, requires only two arguments: IoT Kit username and password. You either define these arguments in `start-agent.sh` script, or, define the two environment variables and the `iotkit-agent` will automatically use them:


    export IOTKIT_AGENT_USR="example-user"
    export IOTKIT_AGENT_PSW="example-password"
    
> Just remember to either source the file where you defined these values or just restart your console to make sure `iotkit-agent` will see these values.
    
### Start

To start the agent service simply execute the `start-agent.sh` file:

    ./start-agent.sh
    
### Stop

    ./stop-agent.sh
    
    
## Usage

Currently the `iotkit-agent` supports the following protocols: 

* MQTT
* REST 
* UDP
* TCP

### Message Format

When integrating the IoT Kit Agent you only have to provide the metric information, everything else will be provided by the agent before your message is relayed to the cloud. Regardless of the protocol used, the `iotkit-agent` expect the inbound message to be in following simple format:

    { "s": "temp-sensor", "m": "air-temp", "v": 26.7 }

Where in:

* s - is the source of this measurement
* m - is the name of this measurement
* v - is the value of this measurement

## Protocol-specific API

Many development frameworks have their own implementation of each one of these protocols. The following command-line examples should give you an idea how to access `iotkit-agent` API:

#### MQTT

Any development framework supporting MQTT client can use local agent. Here is a mosquitto_pub example `tests/mqtt-test.sh`:

    mosquitto_pub -t 'data' \
                  -m '{ "s": "temp-sensor", "m": "air-temp", "v": 26.7 }'
                  
> Note the -t [topic] is required but it can be anything

#### REST (HTTP)

Most development framework have an integrated Web Request object. Here is a curl example `tests/rest-test.sh`:

    curl -i -X PUT http://127.0.0.1:8080/ \
    	  -H 'Content-Type: application/json' \
         --data '{ "s": "temp-sensor", "m": "air-temp", "v": 26.7 }' 
         
#### UDP

Even if your development framework does not support MQTT client or Web Request, you can still use UDP to send data to the Cloud. Here is a command line example `tests/udp-test.sh`:

    echo -n '{ "s": "temp-sensor", "m": "air-temp", "v": 26.7 }' | \
         nc -4u -w1 127.0.0.1 41234
         
#### UDP

If assuring the message delivery to the `iotkit-agent` is important to you (yes, I'm talking about you UDP) you can use a simple TCP socket connection to send data to the Cloud. Here is a command line example `tests/tcp-test.sh`:

    echo -n '{"s": "temp-sensor", "m": "air-temp", "v": 26.7}' | \
         nc 127.0.0.1 7070
         
