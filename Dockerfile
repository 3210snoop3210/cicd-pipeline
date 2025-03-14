FROM node:16
WORKDIR /opt
ADD . /opt
RUN npm install
ENTRYPOINT npm run start
