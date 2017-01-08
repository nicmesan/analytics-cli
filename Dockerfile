FROM ubuntu:14.04

RUN apt-get update

RUN  apt-get install -y nodejs-legacy npm

COPY . /app/analytics-cli

WORKDIR /app/analytics-cli
RUN npm install


CMD ["node server"]
