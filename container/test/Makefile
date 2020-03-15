
#----------------------------------------------------------------------------------------------------------------------
# targets
#----------------------------------------------------------------------------------------------------------------------

SHELL:=/bin/bash
CLIDIR:=node_modules/@open-iot-service-platform/oisp-cli/
CLIBIN:=${CLIDIR}/oisp-cli.js
ROOTDIR:=../../

build:
	@$(call msg,"Install environment for oisp-cli ...")
	@mkdir -p node_modules
	@npm install @open-iot-service-platform/oisp-cli
	#steal configuration from agent
	@echo \{\"admin_file\": \"admin.js\",  > ${CLIDIR}/config/config.json
	@tail -n +2 ${ROOTDIR}/config/config.json >> ${CLIDIR}/config/config.json

clean:
	@$(call msg,"Cleaning environent for oisp-cli ...")
	rm -f testconfig.sh
	rm -rf node_modules

test:
	@./agent-test.sh CLIBIN=${CLIBIN} CLIDIR=${CLIDIR}
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
