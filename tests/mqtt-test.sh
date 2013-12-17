#!/bin/bash

mosquitto_pub -h '127.0.0.1' -t 'test-mqtt-device' -m '{"metric": "temp", "value": 26.7}'

# where
# topic (-t) is a sensor/metric 
# message (-m) is the JSON structure with metric and value 
