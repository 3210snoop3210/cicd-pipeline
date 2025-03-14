FROM node:lts
WORKDIR /opt
ADD . /opt
RUN npm install
ENTRYPOINT npm run start
