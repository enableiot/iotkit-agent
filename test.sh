#!/bin/bash

mosquitto_pub -h "127.0.0.1" -t "test-device/temp" -m "26.7"

# where
# topic (-t) is a sensor/metric 
# message (-m) is only the value
