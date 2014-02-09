#!/bin/bash

echo -n '{ "s": "Temp-Sensor", "t": "float", "u": "Celsius" }' | nc 127.0.0.1 7070
