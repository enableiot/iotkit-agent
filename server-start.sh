#!/bin/bash


if [ $(ps aux | grep node | grep -v grep | wc -l | tr -s "\n") -eq 0 ]
then

	export IOTKIT_AGENT_DIR="${IOTKIT_AGENT_DIR:?/iotkit-agent}"
	export AGENT_LOG_FILE="${IOTKIT_AGENT_DIR}/agent.log"
	export SERVER_MQTT_PORT=1883
	export SERVER_REST_PORT=8080
	export SERVER_UDP_PORT=41234
	export BROKER_HOST="data.enableiot.com"
	export BROKER_PORT=8884
	export BROKER_DATA_TOPIC="data"
	export BROKER_CERT_DIR="${IOTKIT_CERTS_DIR:?certs}"
	export BROKER_HOST_KEY="${BROKER_CERT_DIR}/client.key"
	export BROKER_HOST_CERT="${BROKER_CERT_DIR}/client.crt"
	export BROKER_HOST_USR="${IOTKIT_AGENT_USR:?username}"
	export BROKER_HOST_PSW="${IOTKIT_AGENT_PSW:?password}"
	export CONSOLE_LOG_LEVEL="verbose"
	export FILE_LOG_LEVEL="verbose"

   forever start -m 1 \
   				  -a -l"${IOTKIT_AGENT_DIR}/agent-server.log" \
   			     --sourceDir $IOTKIT_AGENT_DIR \
                 --minUptime 1s \
                 --spinSleepTime 3s server.js
   
fi
