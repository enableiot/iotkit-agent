#!/bin/bash

export MSG='{ "src": "d1234", "metric": "temp", "value": 26.7}'
export HOST='localhost'
export PORT=41234

echo -n $MSG | nc -4u -w1 $HOST $PORT


# where
# message (-m) is the JSON structure with metric and value 
# note, UDP message has to include src as there is no way 
# to pass it in otherwise 
