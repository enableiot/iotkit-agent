#!/bin/bash

BUILD=$1
ROOT_PATH=`pwd`
buildscript_dir=${ROOT_PATH}/buildscripts

BUILD_PREFIX="SCRIPT: "
BUILD_PREFIX_ERROR="SCRIPT-ERROR: "
GRUNT=${ROOT_PATH}/node_modules/grunt-cli/bin/grunt
DIST=dist

cd ${buildscript_dir}/..

echo "${BUILD_PREFIX}I'll package the code"

${GRUNT} packaging --buildID=${BUILD}

if [ $? -ne 0 ]; then
    echo "${BUILD_PREFIX_ERROR}Your grunt test failed again. Last command didn't work. Aborting now."
    exit 1
fi

echo "${BUILD_PREFIX}grunt test was executed without errors. You're lucky ... so far ..."
