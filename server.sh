#!/bin/bash

export AGENT_LOG_FILE="./agent.log"
export SERVER_PORT=1883
export BROKER_HOST="data.enableiot.com"
export BROKER_PORT=8884
export BROKER_DATA_TOPIC="data"
export BROKER_CERT_DIR="/path/certs"
export BROKER_HOST_KEY="${BROKER_CERT_DIR}/client.key"
export BROKER_HOST_CERT="${BROKER_CERT_DIR}/client.crt"
export BROKER_HOST_USR="username"
export BROKER_HOST_PSW="password"

node server

# nohup node server &