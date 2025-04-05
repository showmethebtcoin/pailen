
#!/bin/bash

# Function to clean unused containers and volumes
cleanup() {
  read -p "¿Estás seguro de querer limpiar recursos no utilizados? (y/n): " confirm
  
  if [ "$confirm" = "y" ]; then
    show_message "Limpiando recursos no utilizados..." $YELLOW
    
    # Remove stopped containers
    docker container prune -f
    
    # Remove untagged images
    docker image prune -f
    
    # Remove unused networks
    docker network prune -f
    
    # Ask if volumes should be removed
    read -p "¿Eliminar volúmenes no utilizados? Esto ELIMINARÁ DATOS. (y/n): " confirm_volumes
    
    if [ "$confirm_volumes" = "y" ]; then
      docker volume prune -f
    fi
    
    show_message "Limpieza completada." $GREEN
  fi
}
