
#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Validando configuración de Nginx...${NC}"

# Crear un contenedor temporal para validar la configuración
docker run --rm \
  -v $(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf \
  nginx:alpine \
  nginx -t

# Verificar el resultado
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Configuración de Nginx válida.${NC}"
else
  echo -e "${RED}Error en la configuración de Nginx. Por favor, revisa el archivo nginx.conf.${NC}"
  exit 1
fi
