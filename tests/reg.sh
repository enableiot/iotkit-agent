#!/bin/bash

echo -n '{ "s": "mocked-sensor", "t": "float", "u": "Celsius" }' | nc 127.0.0.1 7070
