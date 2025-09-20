FROM node:18-alpine

# Install Docker CLI
RUN apk add --no-cache docker

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 6000

CMD [ "node", "server.js" ]