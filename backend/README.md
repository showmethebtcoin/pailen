
# Language App Backend

Backend para la aplicación de gestión de estudiantes de idiomas.

## Requisitos

- Node.js (v14 o superior)
- PostgreSQL

## Configuración

1. Clona este repositorio
2. Instala las dependencias:
   ```
   npm install
   ```
3. Crea un archivo `.env` basado en el archivo `.env.example`:
   ```
   cp .env.example .env
   ```
4. Modifica el archivo `.env` con tus propias credenciales
5. Crea una base de datos PostgreSQL llamada `language_app` (o el nombre que hayas configurado en `.env`)

## Estructura del proyecto

```
/src
  /config       # Configuraciones (base de datos, etc.)
  /controllers  # Controladores para manejar la lógica de negocio
  /middleware   # Middleware para autenticación, validación, etc.
  /models       # Modelos de datos (Sequelize)
  /routes       # Rutas de la API
  index.js      # Punto de entrada de la aplicación
```

## Ejecutar el servidor

Desarrollo (con nodemon):
```
npm run dev
```

Producción:
```
npm start
```

## API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar un nuevo usuario
- `POST /api/auth/login` - Iniciar sesión y obtener un token JWT

### Estudiantes

- `GET /api/students` - Obtener todos los estudiantes
- `GET /api/students/:id` - Obtener un estudiante por ID
- `POST /api/students` - Crear un nuevo estudiante
- `PUT /api/students/:id` - Actualizar un estudiante existente
- `DELETE /api/students/:id` - Eliminar un estudiante
