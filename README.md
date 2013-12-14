# iotkit-agent

Edge agent to abstract cloud connectivity complexities. It allows edge developers to focus on writing their experiments and interacting with their I/O parameters. When sending data to the cloud, the message formatting and security is implemented in the agent so only the message payload has to be provided.   

![Agent Topology](../master/images/agent-topo.png?raw=true)

## Installation

In the iotkit-agent directory run:

    npm install
    
## Client API usage

Currently the iotkit-agent supports two forms of API: MQTT and REST. The specific framework integration can be found in the [IoT Kit Sample repo](https://github.com/enableiot/iotkit-samples), here are some quick ways you can test the agent from command line.

### MQTT

Any development framework supporting MQTT client can use local agent. Here is a mosquitto_pub example (tests/mqtt-test.sh):

    mosquitto_pub -h '127.0.0.1' \
                  -t 'test-device' \
                  -m '{"metric": "temp", "value": 26.7}'
                  
> Note the /test-device portion indicates the data source (i.e. sensor)

### REST (HTTP)

Most development framework have an integrated web request object. Here is a curl example (tests/rest-test.sh):

    curl -i -X PUT http://127.0.0.1:8080/test-device \
    	  -H 'Content-Type: application/json' \
         --data '{"metric": "temp", "value": 26.7}' 
         
> Note the /test-device portion indicates the data source (i.e. sensor)

## Message

When integrating the IoT Kit Agent you only have to provide the metric information, everything else will be provided by the agent before your message is relayed to the cloud. Here is the basic structure you must submit to the agent:

    {
      "metric": "temp", 
      "value": 26.7
    }
    
The "metric" is the dimension of the metric (e.g. temperature, speed, voracity etc.) and the value is the corresponding humber to that metric.
