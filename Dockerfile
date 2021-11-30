FROM node:lts-alpine
LABEL maintainer="Gabriel Ferrari Tarallo Ferraz"
LABEL version="1.1"
RUN mkdir -p /usr/projects/clean-node-login-api-js
WORKDIR /usr/projects/clean-node-login-api-js
COPY . .
RUN npm install
RUN npm run build:dev
RUN npm run build
EXPOSE 3333
CMD [ "npm", "start:build" ]
