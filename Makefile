
#----------------------------------------------------------------------------------------------------------------------
# targets
#----------------------------------------------------------------------------------------------------------------------

IMAGE_NAME="open-iot-connector/iotkit-agent"
CONTAINER_NAME="iotkit-agent"

build:
	@$(call msg,"Building iotkit-agent ..."); 
	@/bin/bash -c "docker build . -t ${IMAGE_NAME}"

start:
	@$(call msg,"Starting iotkit-agent ..."); 
	@/bin/bash -c "docker run -d -t -i -p 1884:1884 -p 9090:9090 -p 41234:41234 -p 7070:7070 --name ${CONTAINER_NAME} ${IMAGE_NAME}"

start-local:
	@$(call msg,"Starting iotkit-agent (local) ..."); 
	@/bin/bash -c "docker run -d -t -i -e NODE_ENV=local -p 1884:1884 -p 9090:9090 -p 41234:41234 -p 7070:7070 --name ${CONTAINER_NAME} ${IMAGE_NAME}"

stop:
	@$(call msg,"Stopping iotkit-agent ..."); 
	@/bin/bash -c "docker stop ${CONTAINER_NAME}"

update:
	@$(call msg,"Git Update ..."); 
	@git pull

clean:
	@$(call msg,"Cleaning ..."); 
	@/bin/bash -c "docker rm ${CONTAINER_NAME}"
	@/bin/bash -c "docker rmi ${IMAGE_NAME}"

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