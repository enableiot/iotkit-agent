#!/bin/bash

echo -n '{"s": "mocked-sensor", "m": "air-temp", "v": 26.2}' | nc 127.0.0.1 7070
