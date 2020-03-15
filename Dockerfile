FROM node:10.19.0-alpine

ADD . /app

RUN addgroup -g 1001 -S agent && \
    adduser -u 1001 -S agent -G agent

RUN apk update && apk add bash jq
RUN mkdir /volume && chown -R agent /volume && chown -R agent /app && chmod u+x /app/container/scripts/agent/*
RUN cp -rf /app/config /volume && rm -f /app/config/config.json && ln -s /volume/config/config.json /app/config/config.json

WORKDIR /app


USER agent

RUN npm --force cache clean

RUN npm install
EXPOSE 1884
EXPOSE 8000
EXPOSE 41234
EXPOSE 7070

ENTRYPOINT /app/container/scripts/agent/startup.sh
