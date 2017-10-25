FROM node:4.8.3

ADD . /app

WORKDIR /app

RUN npm cache clean

RUN npm install

EXPOSE 1884
EXPOSE 9090
EXPOSE 41234
EXPOSE 7070

ENTRYPOINT node oisp-agent.js
