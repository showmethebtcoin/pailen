
#!/bin/sh

# Verificar si el servidor está respondiendo
wget -q --spider http://localhost:5000 || exit 1

exit 0
