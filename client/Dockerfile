# client/Dockerfile
FROM node:18 AS build
WORKDIR /app

# Accept build argument
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install
COPY . .

# Make sure Vite picks up the env var
RUN echo "VITE_API_URL=$VITE_API_URL" > .env
RUN npm run build

# Serve build with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
