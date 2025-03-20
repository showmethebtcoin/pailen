
#!/bin/bash

# Function to perform manual backup
manual_backup() {
  show_message "Realizando backup manual de la base de datos..." $YELLOW
  docker-compose exec db /backup.sh
  show_message "Backup completado. Los archivos están en la carpeta 'backups/'." $GREEN
}

# Function to configure scheduled backup
setup_cron() {
  show_message "Configurando backup automático diario..." $YELLOW
  
  # Check if cron entry already exists
  CRON_EXISTS=$(crontab -l | grep -c "docker-compose exec db /backup.sh")
  
  if [ $CRON_EXISTS -eq 0 ]; then
    # Get current crontab
    crontab -l > /tmp/current_cron 2>/dev/null || true
    
    # Add cron task for daily backup at 3 AM
    echo "0 3 * * * cd $(pwd) && docker-compose exec -T db /backup.sh" >> /tmp/current_cron
    
    # Install new crontab
    crontab /tmp/current_cron
    rm /tmp/current_cron
    
    show_message "Backup automático diario configurado a las 3 AM." $GREEN
  else
    show_message "El backup automático ya está configurado." $GREEN
  fi
}
