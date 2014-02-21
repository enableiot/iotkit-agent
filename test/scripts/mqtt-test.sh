#!/bin/bash

mosquitto_pub -t 'data' -m '{"s": "Temp-Sensor", "v": 26.7}'

sleep 3

mosquitto_pub -t 'data' -m '{"s": "Humidity", "v": 30}'
