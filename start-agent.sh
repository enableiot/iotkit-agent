#!/bin/bash


echo ""
echo "============================================"
echo " IoT Kit Agent"
echo "============================================"

# reset logs directory
if [ -f *.log ]; then
	echo "   clearing logs..." 
   rm *.log
fi

# check if forever was installed 
echo "forever: " 
if [[ -n $(npm list -g -parseable forever) ]]
then
   echo "   ok"
else
   echo "   initializing..."
   sudo npm install forever -g
   npm install
fi


export BASE_DIR="${PWD}"
export BROKER_HOST_USR="${IOTKIT_AGENT_USR}"
export BROKER_HOST_PSW="${IOTKIT_AGENT_PSW}"


forever start -m 1 \
              -a -l "${BASE_DIR}/forever.log" \
              --sourceDir $BASE_DIR \
              --minUptime 1s \
              --spinSleepTime 3s agent.js

echo "done"
echo ""


   

