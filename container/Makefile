
#----------------------------------------------------------------------------------------------------------------------
# targets
#----------------------------------------------------------------------------------------------------------------------

SHELL:=/bin/bash
IMAGE_NAME="oisp/oisp-testsensor"
CONTAINER_NAME="oisp-testsensor"
DOCKERFILE_NAME="Dockerfile.testsensor"
TEST_SAMPLE_NUM=10

build:
	@$(call msg,"Building testsensor ...");
	@/bin/bash -c "docker build . -t ${IMAGE_NAME} -f ${DOCKERFILE_NAME}"

start:
	@$(call msg,"Starting testsensor ...");
	@/bin/bash -c "docker run -it --rm --network=host \
		--env TEST_SAMPLES=${TEST_SAMPLE_NUM} \
		--name ${CONTAINER_NAME} ${IMAGE_NAME}"

stop:
	@$(call msg,"Stopping testsensor ...");
	@/bin/bash -c "docker stop ${CONTAINER_NAME}" || echo "${CONTAINER_NAME} cannot be stoped"
	@docker rm  -f ${CONTAINER_NAME} || echo "${CONTAINER_NAME} cannot be removed."

clean: stop
	@$(call msg,"Cleaning ...");
	@/bin/bash -c "docker rmi ${IMAGE_NAME}" || echo "${IMAGE_NAME} cannot be deleted"
	make -C scripts/getagentenv clean

test: build start
	@make -C test test

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
