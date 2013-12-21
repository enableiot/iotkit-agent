#!/bin/bash

curl -i -X PUT http://127.0.0.1:8080 \
	  -H 'Content-Type: application/json' \
     --data '{"d": "air-temp", "m": 26.7, "u": "C"}'

# where
# topic (-t) is a sensor info (not used currently)
# message (-m) is the JSON structure with dimension, metric and unit
# see: https://github.com/enableiot/iotkit-samples/wiki/Metric-Data-Flow-v2
