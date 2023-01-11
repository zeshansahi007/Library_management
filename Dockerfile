FROM node:19

WORKDIR /Users/fahad/Desktop/Desktop

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]