FROM node:alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install && npm cache clean

COPY bin /usr/src/app/bin
COPY routes /usr/src/app/routes
COPY public /usr/src/app/public
COPY views /usr/src/app/views
COPY *.js /usr/src/app/
COPY *.json /usr/src/app/

EXPOSE 8000
CMD [ "npm", "start" ]
