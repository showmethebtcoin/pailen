
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Make sure we set the NODE_ENV to production
ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"]
