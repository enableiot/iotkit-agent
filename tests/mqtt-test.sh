#!/bin/bash

mosquitto_pub -t 'data' -m '{"s": "mocked-sensor", "m": "air-temp", "v": 26.7}'
