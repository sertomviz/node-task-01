
# base image
FROM node:12.2.0-alpine as build

WORKDIR /app

# SOURCE FROM LOCAL
COPY package.json /app
COPY yarn.lock /app

# INSTAL
RUN yarn install

# BUILD
COPY . /app
RUN yarn run build

EXPOSE 3000
CMD ["yarn", "run", "start:container"]
