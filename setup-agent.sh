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

# installing local packages
npm install --production

echo "done"
echo ""
