#!/bin/bash

export BASE_DIR="${PWD}"
FOREVER=${BASE_DIR}/node_modules/forever/bin/forever

${FOREVER} stop agent.js
