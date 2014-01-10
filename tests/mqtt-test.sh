#!/bin/bash

mosquitto_pub -t 'data' -m '{"s": "temp-sensor", "m": "air-temp", "v": 26.7}'
