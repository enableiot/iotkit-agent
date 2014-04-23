#!/bin/bash

ROOT_PATH=`pwd`
buildscript_dir=${ROOT_PATH}/buildscripts

BUILD_PREFIX="SCRIPT: "
BUILD_PREFIX_ERROR="SCRIPT-ERROR: "
GRUNT=${ROOT_PATH}/node_modules/grunt-cli/bin/grunt
DIST=dist


cd ${buildscript_dir}/..


npm config set proxy http://proxy-us.intel.com:911
npm config set https-proxy http://proxy-us.intel.com:911
npm install
if [ $? -ne 0 ]; then
    echo "${BUILD_PREFIX_ERROR}You had an error installing Node Packages. Aborting."
    exit 1
fi

echo "${BUILD_PREFIX}I'll run grunt teamcity"

${GRUNT} teamcity_codevalidation

if [ $? -ne 0 ]; then
    echo "${BUILD_PREFIX_ERROR}Your grunt test failed again. Last command didn't work. Aborting now."
    exit 1
fi

echo "${BUILD_PREFIX}grunt test was executed without errors. Your lucky ... so far ..."
