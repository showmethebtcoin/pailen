
#!/bin/sh

# Verificar si nginx está funcionando
nginx -t || exit 1

# Verificar si el sitio responde
wget -q --spider http://localhost || exit 1

exit 0
