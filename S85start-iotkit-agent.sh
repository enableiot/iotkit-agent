#!/bin/bash

# This is to be copied into the /etc/rc5.d directory so it will be run 
# by the init system at boot

# update local time to UTC
TM=$(curl -s http://www.timeapi.org/utc/now?format=%25Y.%25m.%25d-%25H:%25M)
echo $TM
date "${TM}"

# start agent
cd /home/root/iotkit-agent
./start-agent.sh


