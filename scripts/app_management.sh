
#!/bin/bash

# Function to start the application
start_app() {
  show_message "Iniciando la aplicación..." $YELLOW
  docker-compose up -d
  show_message "¡Aplicación iniciada correctamente!" $GREEN
}

# Function to stop the application
stop_app() {
  show_message "Deteniendo la aplicación..." $YELLOW
  docker-compose down
  show_message "Aplicación detenida." $GREEN
}

# Function to update the application
update_app() {
  show_message "Actualizando la aplicación..." $YELLOW
  
  # Pull changes
  git pull
  
  # Rebuild containers
  docker-compose build
  
  # Restart application
  docker-compose down
  docker-compose up -d
  
  show_message "¡Aplicación actualizada correctamente!" $GREEN
}

# Function to view logs
view_logs() {
  docker-compose logs -f
}
