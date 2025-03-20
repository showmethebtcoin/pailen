
#!/bin/bash

# Variables
BACKUP_DIR="/backups"
POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_DB="${POSTGRES_DB:-language_app}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${POSTGRES_DB}_${TIMESTAMP}.sql"

# Crear directorio de backups si no existe
mkdir -p $BACKUP_DIR

# Realizar backup
echo "Realizando backup de la base de datos ${POSTGRES_DB}..."
pg_dump -U $POSTGRES_USER $POSTGRES_DB > $BACKUP_FILE

# Comprimir el backup
gzip $BACKUP_FILE
echo "Backup completado: ${BACKUP_FILE}.gz"

# Mantener solo los últimos 7 backups (7 días)
find $BACKUP_DIR -name "${POSTGRES_DB}_*.sql.gz" -type f -mtime +7 -delete
echo "Backups antiguos limpiados. Solo se mantienen los últimos 7 días."

# Loggear el resultado
echo "Backup realizado el $(date): ${BACKUP_FILE}.gz" >> "${BACKUP_DIR}/backup_history.log"
