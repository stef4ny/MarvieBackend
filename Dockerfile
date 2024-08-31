FROM node:18-alpine

LABEL key="Paulo Henrique"

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY . ./

RUN npm install

ARG NODEJS_PORT

ENV NODEJS_PORT=$NODEJS_PORT

EXPOSE $NODEJS_PORT

CMD [ "npm", "start" ]