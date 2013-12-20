#!/bin/bash


if [ $(ps aux | grep node | grep -v grep | wc -l | tr -s "\n") -eq 0 ]
then

	export IOTKIT_AGENT_DIR="${IOTKIT_DIR}/iotkit-agent"
	export AGENT_LOG_FILE="${IOTKIT_AGENT_DIR}/agent.log"
	export SERVER_MQTT_PORT=1883
	export SERVER_REST_PORT=8080
	export SERVER_UDP_PORT=41234
	export BROKER_HOST="data.enableiot.com"
	export BROKER_PORT=8884
	export BROKER_DATA_TOPIC="data"
	export BROKER_HOST_KEY="${IOTKIT_AGENT_DIR}/certs/client.key"
	export BROKER_HOST_CERT="${IOTKIT_AGENT_DIR}/certs/client.crt"
	export BROKER_HOST_USR="${IOTKIT_BROKER_USR}"
	export BROKER_HOST_PSW="${IOTKIT_BROKER_PSW}"
	export CONSOLE_LOG_LEVEL="verbose"
	export FILE_LOG_LEVEL="verbose"

   forever start -m 1 \
   				  -a -l"${IOTKIT_AGENT_DIR}/agent-server.log" \
   			     --sourceDir $IOTKIT_AGENT_DIR \
                 --minUptime 1s \
                 --spinSleepTime 3s server.js
   
fi
