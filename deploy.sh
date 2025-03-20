
#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
show_message() {
  echo -e "${2}${1}${NC}"
}

# Función para verificar si Docker está instalado
check_docker() {
  if ! [ -x "$(command -v docker)" ]; then
    show_message "Error: Docker no está instalado." $RED
    exit 1
  fi
  
  if ! [ -x "$(command -v docker-compose)" ]; then
    show_message "Error: Docker Compose no está instalado." $RED
    exit 1
  fi
}

# Función para verificar si .env existe
check_env() {
  if [ ! -f ".env" ]; then
    show_message "No se encontró el archivo .env. Generando desde .env.example..." $YELLOW
    cp .env.example .env
    show_message "Archivo .env creado. Por favor, edítalo con tus configuraciones antes de continuar." $GREEN
    exit 0
  fi
  
  if [ ! -f "backend/.env" ]; then
    show_message "No se encontró el archivo backend/.env. Generando desde backend/.env.example..." $YELLOW
    cp backend/.env.example backend/.env
    show_message "Archivo backend/.env creado. Por favor, edítalo con tus configuraciones antes de continuar." $GREEN
    exit 0
  fi
}

# Función para crear directorios necesarios
create_dirs() {
  mkdir -p backups
  mkdir -p data/certbot/conf
  mkdir -p data/certbot/www
  
  # Dar permisos al script de backup
  mkdir -p scripts
  chmod +x scripts/backup.sh
}

# Función para configurar Let's Encrypt (primera vez)
setup_letsencrypt() {
  read -p "¿Quieres configurar HTTPS con Let's Encrypt? (y/n): " setup_ssl
  
  if [ "$setup_ssl" = "y" ]; then
    read -p "Ingresa tu dominio (ej: example.com): " domain
    read -p "Ingresa tu email para Let's Encrypt: " email
    
    show_message "Configurando Let's Encrypt para $domain..." $YELLOW
    
    # Reemplazar el dominio en nginx.conf
    sed -i "s/example.com/$domain/g" nginx.conf
    
    # Solicitar certificado
    show_message "Solicitando certificado SSL. Esto puede tardar unos minutos..." $YELLOW
    
    docker-compose up --force-recreate --no-deps certbot
    
    show_message "Certificado SSL configurado para $domain" $GREEN
  fi
}

# Función para iniciar la aplicación
start_app() {
  show_message "Iniciando la aplicación..." $YELLOW
  docker-compose up -d
  show_message "¡Aplicación iniciada correctamente!" $GREEN
}

# Función para detener la aplicación
stop_app() {
  show_message "Deteniendo la aplicación..." $YELLOW
  docker-compose down
  show_message "Aplicación detenida." $GREEN
}

# Función para actualizar la aplicación
update_app() {
  show_message "Actualizando la aplicación..." $YELLOW
  
  # Pull de los cambios
  git pull
  
  # Reconstruir contenedores
  docker-compose build
  
  # Reiniciar aplicación
  docker-compose down
  docker-compose up -d
  
  show_message "¡Aplicación actualizada correctamente!" $GREEN
}

# Función para ver logs
view_logs() {
  docker-compose logs -f
}

# Función para realizar backup manual
manual_backup() {
  show_message "Realizando backup manual de la base de datos..." $YELLOW
  docker-compose exec db /backup.sh
  show_message "Backup completado. Los archivos están en la carpeta 'backups/'." $GREEN
}

# Función para configurar backup programado
setup_cron() {
  show_message "Configurando backup automático diario..." $YELLOW
  
  # Buscar si ya existe una entrada cron
  CRON_EXISTS=$(crontab -l | grep -c "docker-compose exec db /backup.sh")
  
  if [ $CRON_EXISTS -eq 0 ]; then
    # Obtener crontab actual
    crontab -l > /tmp/current_cron 2>/dev/null || true
    
    # Añadir tarea cron para backup diario a las 3 AM
    echo "0 3 * * * cd $(pwd) && docker-compose exec -T db /backup.sh" >> /tmp/current_cron
    
    # Instalar nuevo crontab
    crontab /tmp/current_cron
    rm /tmp/current_cron
    
    show_message "Backup automático diario configurado a las 3 AM." $GREEN
  else
    show_message "El backup automático ya está configurado." $GREEN
  fi
}

# Función para limpiar contenedores y volúmenes no utilizados
cleanup() {
  read -p "¿Estás seguro de querer limpiar recursos no utilizados? (y/n): " confirm
  
  if [ "$confirm" = "y" ]; then
    show_message "Limpiando recursos no utilizados..." $YELLOW
    
    # Eliminar contenedores detenidos
    docker container prune -f
    
    # Eliminar imágenes sin etiquetar
    docker image prune -f
    
    # Eliminar redes no utilizadas
    docker network prune -f
    
    # Preguntar si eliminar volúmenes
    read -p "¿Eliminar volúmenes no utilizados? Esto ELIMINARÁ DATOS. (y/n): " confirm_volumes
    
    if [ "$confirm_volumes" = "y" ]; then
      docker volume prune -f
    fi
    
    show_message "Limpieza completada." $GREEN
  fi
}

# Menú principal
show_menu() {
  echo ""
  show_message "=== LANGUAGE APP - SISTEMA DE DESPLIEGUE ===" $GREEN
  echo ""
  echo "1) Iniciar aplicación"
  echo "2) Detener aplicación"
  echo "3) Actualizar aplicación"
  echo "4) Ver logs"
  echo "5) Realizar backup manual"
  echo "6) Configurar backup automático"
  echo "7) Configurar HTTPS con Let's Encrypt"
  echo "8) Limpiar recursos no utilizados"
  echo "0) Salir"
  echo ""
  read -p "Selecciona una opción: " option
  
  case $option in
    1) start_app ;;
    2) stop_app ;;
    3) update_app ;;
    4) view_logs ;;
    5) manual_backup ;;
    6) setup_cron ;;
    7) setup_letsencrypt ;;
    8) cleanup ;;
    0) exit 0 ;;
    *) show_message "Opción inválida" $RED ;;
  esac
  
  # Volver al menú
  show_menu
}

# Verificar requisitos
check_docker
check_env
create_dirs

# Mostrar menú
show_menu
