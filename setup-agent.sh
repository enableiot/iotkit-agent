#!/bin/bash


echo ""
echo "============================================"
echo " IoT Kit Agent - Setup"
echo "============================================"

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


   

