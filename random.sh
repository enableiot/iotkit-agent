#!/bin/bash

while :
do
	./iotkit-admin.js observation temp $((1 + RANDOM % 100))
	sleep 10
done
