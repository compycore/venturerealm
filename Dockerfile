FROM node:alpine

RUN npm install -g typescript

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json /usr/src/app/
RUN npm install && npm cache clean
COPY . /usr/src/app

RUN tsc

CMD [ "npm", "start" ]

EXPOSE 3000
