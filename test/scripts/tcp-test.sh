#!/bin/bash

echo -n '{"s": "Temperature", "v": 28.7}' | nc 127.0.0.1 7070

sleep 3

echo -n '{"s": "Humidity", "v": 35}' | nc 127.0.0.1 7070

sleep 3

echo -n '{"s": "Temperature2", "v": 26.2}' | nc 127.0.0.1 7070

sleep 3

echo -n '{"s": "Humidity2", "v": 30}' | nc 127.0.0.1 7070
