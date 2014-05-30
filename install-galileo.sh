#!/bin/sh
# has bugs
# will add success checks


cd /home/root/
rm -r ./iotkit-agent
wget https://github.com/enableiot/iotkit-agent/archive/dp.zip
unzip dp.zip -d .
cd iotkit-agent-dp
npm install --production

echo " "

echo "This is your device ID. Copy it as the ID and Gateway when adding a new device in the IoT Analytics Dashboard"

echo " "

node admin device-id


#echo -n "Please enter your Device ID after adding it on the Dashboard:"
#read input

#node admin activate input

#echo "Device activated"
