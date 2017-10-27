FROM node:4.8.3

ADD . /app

VOLUME /app/agent/data

WORKDIR /app/agent

RUN npm cache clean

RUN npm install

EXPOSE 1884
EXPOSE 8000
EXPOSE 41234
EXPOSE 7070

ENTRYPOINT node oisp-agent.js
