#!/bin/bash

echo -n '{"s": "Temp-Sensor", "v": 26.2}' | nc 127.0.0.1 7070
