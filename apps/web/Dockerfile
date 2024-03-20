FROM node:18-alpine

LABEL author="PhatDave"

WORKDIR /app

COPY ./build/ ./
COPY package.json ./

EXPOSE 3000
CMD ["node", "index.js"]
