FROM node:10-slim

EXPOSE 5000

RUN mkdir /opt/node_app
WORKDIR /opt/node_app

COPY package.json package-lock.json* ./
RUN npm install --no-optional && npm cache clean --force

COPY . .

CMD [ "npm", "start" ]