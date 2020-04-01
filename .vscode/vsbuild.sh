#!/bin/bash
##
## Build mfw admin UI
##
TARGET=$1

docker-compose -f docker-compose.build.yml up --build
rsync -r -a -v -e "ssh -i /root/.ssh/untangle.openssh.rsa" mfw/* root@$TARGET:/www
