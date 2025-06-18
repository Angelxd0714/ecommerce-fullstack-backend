FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

EXPOSE 3000

COPY . .

RUN npm run build

CMD ["node", "dist/main"]
