# Copyright (c) 2014, Intel Corporation
#
# Redistribution and use in source and binary forms, with or without modification,
# are permitted provided that the following conditions are met:
#
#    * Redistributions of source code must retain the above copyright notice,
#      this list of conditions and the following disclaimer.
#    * Redistributions in binary form must reproduce the above copyright notice,
#      this list of conditions and the following disclaimer in the documentation
#      and/or other materials provided with the distribution.
#    * Neither the name of Intel Corporation nor the names of its contributors
#      may be used to endorse or promote products derived from this software
#      without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
# ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
# ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
# (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
# ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
# SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

#!/bin/bash

buildscript_dir=`pwd`

BUILD_PREFIX="SCRIPT: "
BUILD_PREFIX_ERROR="SCRIPT-ERROR: "
COMPONENT="iotkit-ui"
export http_proxy=http://proxy-us.intel.com:911
export https_proxy=https://proxy-us.intel.com:911

# getopt
help() {
    echo "$0: build and upload package"
    echo "Usage: $0 -e ENVIRONMENT"
}

OPTS=$(getopt -o he: -l environment: -- "$@")
eval set -- "$OPTS"

while true; do
    case "$1" in
        -h) help; shift;;
        -e) ENV=$2; shift 2;;
        --environment) ENV=$2; shift 2;;
        --) shift; break;;
    esac
done

if [ "x$ENV" == "x" ]
then
    help
    exit 1
fi

# main

cd $buildscript_dir/..

echo "${BUILD_PREFIX}I'll generate ${COMPONENT} deployment package for you. I'm so good .."
echo Building ${COMPONENT} for $ENV environment

tar -zcvf ${COMPONENT}.tar.gz package.json app.js config.js dashboard engine iot-entities lib templates
if [ $? -ne 0 ] 
then
    echo "${BUILD_PREFIX_ERROR}Failed again. Package generation failed. Aborting."
    exit 1
else
    if [ ! -d buildscripts/build ]
    then
        mkdir buildscripts/build
    fi
    mv ${COMPONENT}.tar.gz buildscripts/build
fi

echo "${BUILD_PREFIX}Created tar file ${COMPONENT} for you. I'm so good .."
echo "${BUILD_PREFIX}Now upload to S3. I'm so good .."

s3cmd sync buildscripts/build/${COMPONENT}.tar.gz s3://dpeak/artifacts/$ENV/${COMPONENT}.tar.gz
if [ $? -ne 0 ] 
then
    echo "${BUILD_PREFIX_ERROR}Failed again. S3 upload failed. Aborting."
    exit 1
fi

echo "${BUILD_PREFIX}${COMPONENT} package was generated and uploaded to S3 without errors. You're lucky ... so far ..."



