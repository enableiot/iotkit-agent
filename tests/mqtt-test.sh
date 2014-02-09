#!/bin/bash

mosquitto_pub -t 'data' -m '{"s": "Temp-Sensor", "v": 26.7}'
