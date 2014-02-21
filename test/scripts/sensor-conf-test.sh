#!/bin/bash

echo -n '{ "s": "Temperature", "t": "float", "u": "Celsius" }' | nc 127.0.0.1 7070

sleep 3

echo -n '{ "s": "Humidity", "t": "integer", "u": "%" }' | nc 127.0.0.1 7070

sleep 3

echo -n '{ "s": "Humidity2", "t": "integer", "u": "%" }' | nc 127.0.0.1 7070

sleep 3

echo -n '{ "s": "Temperature2", "t": "float", "u": "Celsius" }' | nc 127.0.0.1 7070
