#!/bin/bash

export APP_DIR="/home/username/iotkit-agent"
export AGENT_LOG_FILE="./agent.log"
export SERVER_MQTT_PORT=1883
export SERVER_REST_PORT=8080
export SERVER_UDP_PORT=41234
export BROKER_HOST="data.enableiot.com"
export BROKER_PORT=8884
export BROKER_DATA_TOPIC="data"
export BROKER_CERT_DIR="certs"
export BROKER_HOST_KEY="${BROKER_CERT_DIR}/client.key"
export BROKER_HOST_CERT="${BROKER_CERT_DIR}/client.crt"
export BROKER_HOST_USR="username"
export BROKER_HOST_PSW="password"


if [ $(ps aux | grep node | grep -v grep | wc -l | tr -s "\n") -eq 0 ]
then
    forever start --sourceDir $APP_DIR server.js
fi
