#!/bin/bash


echo ""
echo "============================================"
echo " IoT Kit Agent - Setup"
echo "============================================"

# if not root, try to use sudo
if [[ `whoami` != "root" ]];
then
SUDO=sudo
else
SUDO=
fi

# inject the file which starts the agent into the init process at run level 5
echo "copying startup script"
if [[ -d /etc/rc5.d/ ]]
then
${SUDO} cp -f ./S85start-iotkit-agent.sh /etc/rc5.d/
else
echo "no /etc/rc5.d directory - startup script not copied"
fi

# installing local packages
npm install --production

echo "done"
echo ""
