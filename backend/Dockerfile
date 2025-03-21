
FROM node:18-alpine

# Instalar dependencias necesarias para Chrome y Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn

# Establecer variables de entorno para Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Copiar el script de healthcheck
COPY docker-healthcheck.sh /docker-healthcheck.sh
RUN chmod +x /docker-healthcheck.sh

HEALTHCHECK --interval=30s --timeout=3s CMD /docker-healthcheck.sh

EXPOSE 5000

CMD ["npm", "start"]
