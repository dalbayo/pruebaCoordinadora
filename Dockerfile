# syntax=docker/dockerfile:1
FROM node:22.13.1-alpine3.20
WORKDIR /src
COPY package.json .
RUN npm install
RUN npm install -g nodemon

EXPOSE 8000

COPY . .
# CMD npm start

#Default command
CMD ["npm","start"]
