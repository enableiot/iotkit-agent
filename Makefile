
#----------------------------------------------------------------------------------------------------------------------
# targets
#----------------------------------------------------------------------------------------------------------------------

IMAGE_NAME = oisp/oisp-iot-agent
CONTAINER_NAME = oisp-iot-agent
GETAGENTENVDIR = container/test
GETSAMPLES = ./getSamples.sh
CONFIGFILE = ${GETAGENTENVDIR}/testconfig.sh

DEVICENAME:=agenttestdevice
SHELL := /bin/bash
OISP_PREP_FILE ?= ../tests/oisp-prep-only.conf
USERNAME = $(shell cat ${OISP_PREP_FILE} | jq .username)
PASSWORD = $(shell cat ${OISP_PREP_FILE} | jq .password)
ACCOUNTID = $(shell cat ${OISP_PREP_FILE} | jq .accountId)
COMPONENT_NAME = "temp"

build:
	@$(call msg,"Building oisp-agent ...");
	@docker build . -t ${IMAGE_NAME}

start:
	@$(call msg,"Starting oisp-agent container...");
	@echo USERNAME=${USERNAME} PASSWORD=${PASSWORD}
	@source ${CONFIGFILE}  && \
		echo Starting container with the following settings: OISP_DEVICE_ACTIVATION_CODE="$${OISP_DEVICE_ACTIVATION_CODE}" \
		OISP_DEVICE_ID="$${OISP_DEVICE_ID}" && \
		docker run  \
					-d -t -i --network=host --rm \
					--env OISP_DEVICE_ACTIVATION_CODE=$${OISP_DEVICE_ACTIVATION_CODE} \
					--env OISP_DEVICE_ID=$${OISP_DEVICE_ID} \
					--env	OISP_DEVICE_NAME=$${OISP_DEVICE_NAME} \
					--env	OISP_FORCE_REACTIVATION=$${OISP_FORCE_REACTIVATION} \
					--name ${CONTAINER_NAME} ${IMAGE_NAME}

stop:
	@$(call msg,"Stopping oisp-agent ...");
	@docker stop ${CONTAINER_NAME} || echo "${CONTAINER_NAME} cannot be stopped."
	@docker rm  -f ${CONTAINER_NAME} || echo "${CONTAINER_NAME} cannot be removed."
	@make -C container stop


clean: stop
	@$(call msg,"Cleaning ...");
	@docker rm -f ${CONTAINER_NAME} || echo "${CONTAINER_NAME} cannot be deleted"
	@/bin/bash -c "docker rmi -f ${IMAGE_NAME}" || echo "${IMAGE_NAME} cannot be deleted"
	@rm -f .prepare-testconfig
	@make -C container clean
	@./oisp-admin.js  reset-data-directory
	@rm -f config/config.json

.prepare-testconfig:
		@cp config/config.json.circleci config/config.json
		cd ${GETAGENTENVDIR} && make build && source ./getActivationCode.sh ${USERNAME} ${PASSWORD} ${DEVICENAME}
		@touch $@

test: .prepare-testconfig build start
	@make COMPONENT_NAME=${COMPONENT_NAME} ACCOUNTID=${ACCOUNTID} DEVICENAME=${DEVICENAME} -C container test

#----------------------------------------------------------------------------------------------------------------------
# helper functions
#----------------------------------------------------------------------------------------------------------------------

define msg
	tput setaf 2 && \
	for i in $(shell seq 1 120 ); do echo -n "-"; done; echo -n "\n" && \
	echo "\t"$1 && \
	for i in $(shell seq 1 120 ); do echo -n "-"; done; echo "\n" && \
	tput sgr0
endef
