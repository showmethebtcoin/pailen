
#!/bin/bash

# Source all scripts
source ./scripts/app_management.sh
source ./scripts/backup_management.sh
source ./scripts/ssl_config.sh
source ./scripts/cleanup.sh

# Main menu
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
  
  # Return to menu
  show_menu
}
