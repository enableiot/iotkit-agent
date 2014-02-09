#!/bin/bash

echo -n '{"s": "Temperature", "v": 26.2}' | nc 127.0.0.1 7070

sleep 3

echo -n '{"s": "Humidity", "v": 30}' | nc 127.0.0.1 7070
