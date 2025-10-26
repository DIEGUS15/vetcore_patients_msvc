# VetCore - Patients Service

Microservicio de gestión de pacientes (mascotas) para el sistema VetCore. Maneja el registro, actualización, consulta y eliminación de información de las mascotas atendidas en la veterinaria.

## Características

- CRUD completo de pacientes/mascotas
- Validación de tokens JWT para autenticación
- Base de datos MySQL dedicada
- Protección de rutas mediante middleware de autenticación
- Soft delete de registros
- Sincronización automática de modelos con la base de datos

## Tecnologías

- Node.js + Express
- Sequelize ORM
- MySQL 8.0
- JWT (jsonwebtoken)
- dotenv

## Estructura del Proyecto

```
vetcore_patients_msvc/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de Sequelize
│   ├── controllers/
│   │   └── petController.js     # Lógica de negocio de mascotas
│   ├── middlewares/
│   │   └── authMiddleware.js    # Verificación de JWT
│   ├── models/
│   │   └── Pet.js               # Modelo de mascotas
│   └── routes/
│       └── petRoutes.js         # Rutas de mascotas
├── .env                         # Variables de entorno
├── .env.example                 # Ejemplo de variables
├── index.js                     # Punto de entrada
├── Dockerfile                   # Para construcción de imagen
├── docker-compose.yml           # Para ejecución individual
└── package.json
```

## Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=vetcore_patients_db
DB_USER=vetcore_patients_user
DB_PASSWORD=vetcore_pass

# JWT (debe coincidir con Auth Service)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h
```

**Importante:** El `JWT_SECRET` debe ser el mismo que el usado en Auth Service para que la validación de tokens funcione correctamente.

## Instalación y Ejecución

### Opción 1: Ejecución Local sin Docker (Desarrollo rápido)

**Requisitos previos:**
- Node.js 18+ instalado
- MySQL 8.0 corriendo en localhost:3306
- Base de datos `vetcore_patients_db` creada

**Pasos:**

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Editar .env con tus credenciales de MySQL local
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **O ejecutar en modo producción:**
   ```bash
   npm start
   ```

El servicio estará disponible en `http://localhost:3001`

---

### Opción 2: Ejecución con Docker Compose (Incluye MySQL)

**Requisitos previos:**
- Docker Desktop instalado y corriendo

**Pasos:**

1. **Levantar el servicio con su base de datos:**
   ```bash
   docker-compose up
   ```

   Esto levantará:
   - Patients Service en el puerto `3001`
   - MySQL en el puerto `3307` (mapeado externamente)

2. **Levantar en segundo plano:**
   ```bash
   docker-compose up -d
   ```

3. **Ver logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Detener el servicio:**
   ```bash
   docker-compose down
   ```

---

### Opción 3: Construcción y Publicación de Imagen Docker

**Para construir la imagen localmente:**

```bash
# Construir con nombre local
docker build -t vetcore-patients:latest .

# O construir con tu usuario de Docker Hub
docker build -t tuusuario/vetcore-patients:latest .
```

**Para publicar en Docker Hub (opcional):**

1. **Login en Docker Hub:**
   ```bash
   docker login
   ```

2. **Construir con tu usuario:**
   ```bash
   docker build -t tuusuario/vetcore-patients:latest .
   ```

3. **Publicar imagen:**
   ```bash
   docker push tuusuario/vetcore-patients:latest
   ```

4. **Otros pueden descargar tu imagen:**
   ```bash
   docker pull tuusuario/vetcore-patients:latest
   ```

---

## API Endpoints

Todos los endpoints requieren autenticación mediante token JWT en el header `Authorization: Bearer <token>`.

### Pacientes/Mascotas

#### `GET /api/patients`
Obtiene todos los pacientes registrados.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Max",
    "species": "Perro",
    "breed": "Labrador",
    "age": 3,
    "weight": 25.5,
    "ownerName": "Juan Pérez",
    "ownerContact": "555-1234",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
]
```

#### `GET /api/patients/:id`
Obtiene un paciente específico por ID.

**Response:**
```json
{
  "id": 1,
  "name": "Max",
  "species": "Perro",
  "breed": "Labrador",
  "age": 3,
  "weight": 25.5,
  "ownerName": "Juan Pérez",
  "ownerContact": "555-1234"
}
```

#### `POST /api/patients`
Crea un nuevo paciente.

**Request body:**
```json
{
  "name": "Max",
  "species": "Perro",
  "breed": "Labrador",
  "age": 3,
  "weight": 25.5,
  "ownerName": "Juan Pérez",
  "ownerContact": "555-1234"
}
```

**Response:**
```json
{
  "message": "Patient created successfully",
  "patient": {
    "id": 1,
    "name": "Max",
    "species": "Perro",
    "breed": "Labrador",
    "age": 3,
    "weight": 25.5,
    "ownerName": "Juan Pérez",
    "ownerContact": "555-1234"
  }
}
```

#### `PUT /api/patients/:id`
Actualiza un paciente existente.

**Request body:**
```json
{
  "age": 4,
  "weight": 27.0
}
```

**Response:**
```json
{
  "message": "Patient updated successfully",
  "patient": {
    "id": 1,
    "name": "Max",
    "age": 4,
    "weight": 27.0
  }
}
```

#### `DELETE /api/patients/:id`
Elimina un paciente (soft delete).

**Response:**
```json
{
  "message": "Patient deleted successfully"
}
```

---

## Modelo de Datos

### Tabla: pets

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | ID auto-incremental (PK) |
| name | STRING | Nombre de la mascota |
| species | STRING | Especie (Perro, Gato, etc.) |
| breed | STRING | Raza |
| age | INTEGER | Edad en años |
| weight | FLOAT | Peso en kg |
| ownerName | STRING | Nombre del dueño |
| ownerContact | STRING | Contacto del dueño |
| createdAt | DATE | Fecha de creación |
| updatedAt | DATE | Fecha de última actualización |

---

## Base de Datos

### Conexión con MySQL Workbench

Si estás usando Docker Compose, puedes conectarte a la base de datos con:

```
Host: 127.0.0.1
Port: 3307
Username: root
Password: rootpassword
Database: vetcore_patients_db
```

---

## Testing

```bash
# Ejecutar tests (cuando estén configurados)
npm test
```

---

## Troubleshooting

### Error: "Unable to connect to the database"

- Verifica que MySQL esté corriendo
- Verifica las credenciales en el archivo `.env`
- Si usas Docker, verifica que el contenedor de MySQL esté healthy: `docker ps`

### Error: "Port 3001 is already in use"

- Cambia el puerto en `.env`:
  ```env
  PORT=3002
  ```

### Error: "Invalid token" o "No token provided"

- Asegúrate de incluir el header `Authorization: Bearer <token>` en tus peticiones
- Verifica que el `JWT_SECRET` sea el mismo que en Auth Service
- El token debe obtenerse del endpoint de login del Auth Service

### Los cambios no se reflejan en Docker

- Reconstruye la imagen:
  ```bash
  docker-compose up --build
  ```

---

## Parte del Sistema VetCore

Este servicio es parte de **VetCore**, un sistema de microservicios para la gestión integral de veterinarias. VetCore está compuesto por:

- **Auth Service** - Autenticación y autorización
- **Patients Service** (este servicio) - Gestión de pacientes/mascotas
- **API Gateway** - Punto de entrada único y enrutamiento
- **Frontend** - Interfaz de usuario en React
- **Appointments Service** (próximamente) - Gestión de citas

Para ejecutar el sistema completo, consulta el repositorio `vetcore-infrastructure`.

---

## Licencia

Este proyecto es parte de VetCore y está bajo [indicar licencia].

## Contribuciones

[Indicar cómo contribuir al proyecto]

## Contacto

[Indicar información de contacto o enlaces al proyecto principal]