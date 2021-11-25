FROM node:lts-alpine
LABEL maintainer="Gabriel Ferrari Tarallo Ferraz"
LABEL version="1.1"
RUN mkdir -p /project/clean-node-login-api-js
WORKDIR /project/clean-node-login-api-js
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3333
