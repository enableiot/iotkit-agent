#!/bin/bash

echo "MQTT..."
./mqtt-test.sh

echo "UDP..."
./udp-test.sh

echo "TCP..."
./tcp-test.sh

echo "REST..."
./rest-test.sh

echo ""
echo "DONE"