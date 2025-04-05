
#!/bin/bash

# Function to verify if Docker is installed
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

# Function to verify if .env exists
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

# Function to create required directories
create_dirs() {
  mkdir -p backups
  mkdir -p data/certbot/conf
  mkdir -p data/certbot/www
  
  # Give permissions to backup script
  mkdir -p scripts
  chmod +x scripts/backup.sh
}
