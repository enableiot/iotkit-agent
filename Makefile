
#----------------------------------------------------------------------------------------------------------------------
# targets
#----------------------------------------------------------------------------------------------------------------------

IMAGE_NAME="oisp/oisp-agent"
CONTAINER_NAME="oisp-agent"

build:
	@$(call msg,"Building oisp-agent ...");
	@/bin/bash -c "docker build . -t ${IMAGE_NAME}"

configure:
	@$(call msg,"Configure oisp-agent (using bash) ...");
	@/bin/bash -c "docker run -t -i --rm --network=host -v ${PWD}/agent/data:/app/agent/data -p 1884:1884 -p 8000:8000 -p 41234:41234 -p 7070:7070 --name ${CONTAINER_NAME} --entrypoint='/bin/bash' ${IMAGE_NAME}"

start:
	@$(call msg,"Starting oisp-agent ...");
	@/bin/bash -c "docker run -d -t -i --rm --network=host -v ${PWD}/agent/data:/app/agent/data -p 1884:1884 -p 8000:8000 -p 41234:41234 -p 7070:7070 --name ${CONTAINER_NAME} ${IMAGE_NAME}"

start-local:
	@$(call msg,"Starting oisp-agent (local) ...");
	@/bin/bash -c "docker run -d -t -i -e NODE_ENV=local --rm --network=host -v ${PWD}/agent/data:/app/agent/data -p 1884:1884 -p 8000:8000 -p 41234:41234 -p 7070:7070 --name ${CONTAINER_NAME} ${IMAGE_NAME}"

stop:
	@$(call msg,"Stopping oisp-agent ...");
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
