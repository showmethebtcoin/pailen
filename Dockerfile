
# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Build the app (using production mode by default)
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Pass env variables to frontend build if needed
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Production environment
FROM nginx:alpine

# Copy build files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy healthcheck script
COPY --from=build /app/docker-healthcheck.sh /docker-healthcheck.sh
RUN chmod +x /docker-healthcheck.sh

HEALTHCHECK --interval=30s --timeout=3s CMD /docker-healthcheck.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
