
#!/bin/bash

# Function to configure Let's Encrypt (first time)
setup_letsencrypt() {
  read -p "¿Quieres configurar HTTPS con Let's Encrypt? (y/n): " setup_ssl
  
  if [ "$setup_ssl" = "y" ]; then
    read -p "Ingresa tu dominio (ej: example.com): " domain
    read -p "Ingresa tu email para Let's Encrypt: " email
    
    show_message "Configurando Let's Encrypt para $domain..." $YELLOW
    
    # Replace domain in nginx.conf
    sed -i "s/example.com/$domain/g" nginx.conf
    
    # Request certificate
    show_message "Solicitando certificado SSL. Esto puede tardar unos minutos..." $YELLOW
    
    docker-compose up --force-recreate --no-deps certbot
    
    show_message "Certificado SSL configurado para $domain" $GREEN
  fi
}
