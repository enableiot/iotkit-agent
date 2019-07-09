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


if [ ! -d ${MNTDIR}/data ]; then
  mkdir ${MNTDIR}/data
fi
if [ ! -f ${MNTDIR}/data/device.json ];then
  cp ${ROOTDIR}/data/device.json ${MNTDIR}/data
fi

rm -rf ${ROOTDIR}/data
#ln -s ${MNTDIR}/config ${ROOTDIR}/config
ln -s ${MNTDIR}/data ${ROOTDIR}/data

# activate if needed
(cd ${ROOTDIR}/container/scripts/agent; ./onboard.sh) || exit 1

echo Now starting agent
(cd ${ROOTDIR}; ./oisp-agent.js) || exit 1
