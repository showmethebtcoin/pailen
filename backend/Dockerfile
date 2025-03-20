
FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Make sure we set the NODE_ENV to production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Add health check capability
COPY docker-healthcheck.sh /docker-healthcheck.sh
RUN chmod +x /docker-healthcheck.sh

HEALTHCHECK --interval=30s --timeout=3s CMD /docker-healthcheck.sh

EXPOSE 5000

CMD ["npm", "start"]
