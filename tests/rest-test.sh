#!/bin/bash

curl -i -X PUT http://127.0.0.1:9090 \
	  -H 'Content-Type: application/json' \
     --data '{"s": "Temp-Sensor", "v": 26.7}'

