
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Build the app
RUN npm run build

# Production environment
FROM nginx:alpine

# Copy build files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
