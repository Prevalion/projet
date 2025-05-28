FROM node:18-alpine as builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./ 
RUN npm install
COPY . .
RUN npm run build


