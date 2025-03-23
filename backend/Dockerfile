
FROM node:18-alpine

# Instalar dependencias necesarias para Chrome, Puppeteer y herramientas de red
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn \
    curl

# Establecer variables de entorno para Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package*.json ./

# Instalar dependencias sin caching para asegurarnos que todo esté actualizado
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Copiar el script de healthcheck y hacerlo ejecutable
COPY docker-healthcheck.sh /docker-healthcheck.sh
RUN chmod +x /docker-healthcheck.sh

# Configurar healthcheck
HEALTHCHECK --interval=60s --timeout=30s --retries=5 --start-period=120s CMD /docker-healthcheck.sh

EXPOSE 5000

CMD ["npm", "start"]
