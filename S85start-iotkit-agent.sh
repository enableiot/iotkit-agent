#!/bin/bash

# This is to be copied into the /etc/rc5.d directory so it will be run 
# by the init system at boot

cd /home/root/iotkit-agent
./start-agent.sh
