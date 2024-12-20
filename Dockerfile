FROM node:20-alpine

WORKDIR /app

COPY package.json /app

RUN npm i -g yarn

RUN yarn

COPY . /app

CMD ["yarn", "start:dev"]