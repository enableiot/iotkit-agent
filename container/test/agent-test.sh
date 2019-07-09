#!/bin/bash
source ./testconfig.sh
fail() {
    echo "Test failed becaus $1"
    exit 1
}
echo executing testscript with ACCOUNTID=${ACCOUNTID} DEVICENAME=${DEVICENAME} COMPONENTNAME=${COMPONENT_NAME}
echo Testing whether all points have been received
points=$(./getSamples.sh ${ACCOUNTID} ${DEVICENAME} ${COMPONENT_NAME} | grep -v info)
echo points found: $points
if [ ! "${points}" = "10" ]; then fail "wrong number of returned points: $points"
fi
echo Test executed successful
