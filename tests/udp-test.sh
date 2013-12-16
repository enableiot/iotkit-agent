#!/bin/bash

echo -n '{ "src": "d1234", "metric": "temp", "value": 26.7}' | \
     nc -4u -w1 'localhost' 41234


# where
# message (-m) is the JSON structure with metric and value 
# note, UDP message has to include src as there is no way 
# to pass it in otherwise 
