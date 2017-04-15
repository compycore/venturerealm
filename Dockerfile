FROM node:alpine

RUN npm install -g typescript
 
RUN mkdir /app
WORKDIR /app
ADD . /app

RUN tsc

EXPOSE 8000
