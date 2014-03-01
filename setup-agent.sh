#!/bin/bash

echo ""
echo "============================================"
echo " IoT Kit Agent - Setup"
echo "============================================"

FOREVER=true

# if not root, try to use sudo
if [[ `whoami` == "root" ]];
then
	SUDO=""
else
	SUDO="sudo"
fi

# try add a startup script to our init system
echo "copying startup script"
if [[ -d /etc/systemd/system ]]
then
	$SUDO cp -f ./iotkit-agent.service /etc/systemd/system/
	$SUDO systemctl enable iotkit-agent
	FOREVER=false
elif [[ -d /etc/rc5.d/ ]]
then
	$SUDO cp -f ./S85start-iotkit-agent.sh /etc/rc5.d/
else
	echo "no /etc/rc5.d directory - startup script not copied"
fi

# copy config file and resources
echo "copying resources & configs"
$SUDO mkdir /usr/share/iotkit-agent
$SUDO cp -r ./certs /usr/share/iotkit-agent/
if [[ -d /etc/iotkit-agent ]]
then
	echo "agent already installed previously, not overwriting config files!"
else
	$SUDO mkdir /etc/iotkit-agent
	# since we have node, use it to modify the paths and create the new conf file
	node -pe "x=JSON.parse(process.argv[1]); x.key = '/usr/share/iotkit-agent/certs/client.key'; x.crt \
		= '/usr/share/iotkit-agent/certs/client.crt'; JSON.stringify(x, null, 4)" "$(cat ./config.json)" \
		> /tmp/config.json.iotkit.tmp
	# use a tmp file to avoid sudo redirection issues
	$SUDO cp /tmp/config.json.iotkit.tmp /etc/iotkit-agent/config.json
fi

# if using forever
if [ "$FOREVER" = true ]
then
	# check if forever was installed
	echo "forever: "
	if [[ -n $(npm list -g -parseable forever) ]]
	then
		echo "   ok"
	else
		echo "   installing ..."
	$SUDO npm install forever -g
	fi
fi

# installing packages globally
$SUDO npm install -g

echo "done"
echo ""
