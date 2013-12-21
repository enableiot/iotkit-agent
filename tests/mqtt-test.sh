#!/bin/bash

mosquitto_pub -h '127.0.0.1' -t 'test-mqtt-device' -m '{"d": "air-temp", "m": 26.7, "u": "C"}'

# where
# topic (-t) is a sensor info (not used currently)
# message (-m) is the JSON structure with dimension, metric and unit
# see: https://github.com/enableiot/iotkit-samples/wiki/Metric-Data-Flow-v2
