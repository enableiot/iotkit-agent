#!/bin/bash

echo -n '{"d": "air-temp", "m": 26.7, "u": "C"}' | \
     nc -4u -w1 'localhost' 41234


# where
# topic (-t) is a sensor info (not used currently)
# message (-m) is the JSON structure with dimension, metric and unit
# see: https://github.com/enableiot/iotkit-samples/wiki/Metric-Data-Flow-v2
