#!/bin/bash
# Author: Marcel Wagner
# Brief: This script is main entrypoint for the Container


# mount config and data directory
# agent expects ./config and ./data locally
# Volume is mounted to /var and ./config and ./data are mounted to /var/config
# and /var/data
# copy ./config/index.js and ./config/config,json only if non-existent
# and ./data/device.json if non existent
ROOTDIR=/app
MNTDIR=/volume

function fail {
    echo $1
    exit 1
}

if [ ! -d ${MNTDIR}/data ]; then
  mkdir ${MNTDIR}/data
fi
if [ ! -f ${MNTDIR}/data/device.json ];then
  cp ${ROOTDIR}/data/device.json ${MNTDIR}/data
fi

if [ -f ${MNTDIR}/config/config.json ];then
  cp ${MNTDIR}/config/config.json ${ROOTDIR}/config/config.json
fi

rm -rf ${ROOTDIR}/data
ln -s ${MNTDIR}/data ${ROOTDIR}/data

# activate if needed
(cd ${ROOTDIR}/container/scripts/agent; ./onboard.sh) || fail "Onboarding failed. Bye!"

echo Now starting agent
(cd ${ROOTDIR}; ./oisp-agent.js) || fail "Agent startup failed. Bye!"
