#!/bin/bash

echo -n '{"s": "Temperature", "v": 26.7}' | nc -4u -w1 127.0.0.1 41234

sleep 3

echo -n '{"s": "Humidity", "v": 30}' | nc -4u -w1 127.0.0.1 41234
