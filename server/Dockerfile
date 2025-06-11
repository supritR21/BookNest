# backend/Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=3500
EXPOSE 3500

CMD ["node", "server.js"]
