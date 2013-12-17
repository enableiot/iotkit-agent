#!/bin/bash

curl -i -X PUT http://127.0.0.1:8080/test-rest-device \
	  -H 'Content-Type: application/json' \
     --data '{"metric": "temp", "value": 26.7}' 

# where
# test-device is the sensor
# data is the JSON structure with metric and value 
