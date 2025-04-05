
#!/bin/sh

# Establecer variables para los reintentos y tiempo de espera
MAX_RETRIES=3
RETRY_INTERVAL=5
API_URL="http://localhost:5000/api/auth/health"

# Intentar conectar al endpoint de salud con reintentos
for i in $(seq 1 $MAX_RETRIES); do
  echo "Healthcheck intento $i de $MAX_RETRIES..."
  
  # Usar curl en lugar de wget con tiempo de espera reducido
  RESPONSE=$(curl -s -m 5 -o /dev/null -w "%{http_code}" $API_URL)
  
  if [ "$RESPONSE" = "200" ]; then
    echo "Healthcheck exitoso: API respondiendo con código 200"
    exit 0
  else
    echo "Healthcheck fallido ($RESPONSE). Reintentando en $RETRY_INTERVAL segundos..."
    sleep $RETRY_INTERVAL
  fi
done

echo "Healthcheck falló después de $MAX_RETRIES intentos"
exit 1
