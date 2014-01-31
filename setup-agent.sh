#!/bin/bash


echo ""
echo "============================================"
echo " IoT Kit Agent - Setup"
echo "============================================"

# inject the file which starts the agent into the init process at run level 5
echo "copying startup script"
if [[ -d /etc/rc5.d/ ]]
then
	cp -f S85start-iotkit-agent.sh /etc/rc5.d/
else
	echo "no /etc/rc5.d directory - startup script not copied"
fi

# check if forever was installed 
echo "forever: " 
if [[ -n $(npm list -g -parseable forever) ]]
then
   echo "   ok"
else
   echo "   initializing..."
   sudo npm install forever -g
fi

# installing local packages
npm install

echo "done"
echo ""