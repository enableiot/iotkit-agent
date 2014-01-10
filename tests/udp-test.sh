#!/bin/bash

echo -n '{"s": "temp-sensor", "m": "air-temp", "v": 26.7}' | \
     nc -4u -w1 127.0.0.1 41234
