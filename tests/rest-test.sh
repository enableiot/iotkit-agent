#!/bin/bash

curl -i -X PUT http://127.0.0.1:9090 \
	  -H 'Content-Type: application/json' \
     --data '{"s": "temp-sensor", "m": "air-temp", "v": 26.7}'

