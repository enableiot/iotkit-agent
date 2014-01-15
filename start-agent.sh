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

export BASE_DIR="${PWD}"

forever start -m 1 \
              -a -l "${BASE_DIR}/forever.log" \
              --sourceDir $BASE_DIR \
              --minUptime 1s \
              --spinSleepTime 3s agent.js

echo "done"
echo ""


   

