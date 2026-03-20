# API backend — AdoptMe (proyecto final)

## Objetivo del entregable

API REST desarrollada con **Node.js**, **Express** y **MongoDB** (Mongoose), orientada a la gestión de usuarios, mascotas, adopciones y sesiones. El presente documento resume el contenido del repositorio, los requisitos de ejecución, las pruebas automatizadas, la documentación OpenAPI del módulo de usuarios y el uso de la imagen publicada en Docker Hub.

## Enlaces

| Recurso | URL |
|--------|-----|
| **Repositorio (código fuente)** | [github.com/MaximilianoRodrigoMartinez/ProyectoFinalFullstack-Martinez](https://github.com/MaximilianoRodrigoMartinez/ProyectoFinalFullstack-Martinez) |
| **Imagen Docker (Docker Hub)** | [hub.docker.com/r/maxisdocker/adoptme-api](https://hub.docker.com/r/maxisdocker/adoptme-api) |

La carpeta de la aplicación Node se encuentra en `RecursosBackend-Adoptme-main/` respecto de la raíz del repositorio. El directorio `node_modules` no se versiona (`.gitignore`).

## Credenciales y archivo `.env`

La aplicación requiere una variable **`MONGODB_URI`** (cadena de conexión a MongoDB, p. ej. MongoDB Atlas). En el repositorio se incluye únicamente **`.env.example`** como plantilla.

**No se incluye el archivo `.env` en el repositorio** (contiene secretos). Para la corrección, el estudiante debe adjuntar el `.env` por el **medio oficial de entrega** de la asignatura (plataforma, aula virtual o indicación explícita del docente), salvo que la cátedra disponga un entorno con base de datos ya provista.

## Requisitos previos

- **Node.js** 18 o superior (recomendado 20 LTS).
- Instancia **MongoDB** accesible desde la máquina o contenedor donde se ejecute la API (p. ej. Atlas).
- Opcional: **Docker** (solo si se desea ejecutar la imagen de Docker Hub o reconstruir la imagen localmente).

## Ejecución local (revisión sin Docker)

Desde la raíz del clon del repositorio:

```bash
cd RecursosBackend-Adoptme-main
npm ci
```

Copiar la plantilla de variables y completar `MONGODB_URI` (o utilizar el `.env` adjunto a la entrega):

```bash
copy .env.example .env
```

En sistemas Unix: `cp .env.example .env`.

Arranque en modo desarrollo (recarga con cambios) o producción simple:

```bash
npm run dev
```

o

```bash
npm start
```

La API escucha en el puerto definido por **`PORT`** (por defecto **8080**).

- **Documentación Swagger (módulo Users):** `http://localhost:<PORT>/api-docs`

## Pruebas automatizadas

Desde `RecursosBackend-Adoptme-main/`:

```bash
npm test
```

Se ejecutan pruebas funcionales con **Mocha**, **Chai** y **Supertest**, incluyendo los endpoints del router de sesiones y del router de adopciones, con **MongoDB en memoria** (no requiere `MONGODB_URI` para los tests).

## Imagen Docker (Docker Hub)

Imagen publicada (etiqueta indicativa):

```text
maxisdocker/adoptme-api:latest
```

**Obtener la imagen:**

```bash
docker pull maxisdocker/adoptme-api:latest
```

**Ejecutar el contenedor** (sustituir la URI por una cadena válida; el host debe poder alcanzar MongoDB):

```bash
docker run --rm -p 8080:8080 -e MONGODB_URI="mongodb+srv://..." -e PORT=8080 maxisdocker/adoptme-api:latest
```

Tras el arranque, la documentación interactiva del módulo Users queda disponible en `http://localhost:8080/api-docs` (ajustar host/puerto si corresponde).

**Construcción local de la imagen** a partir del clon del monorepo (ejecutar desde la **raíz** del repositorio, no desde la subcarpeta del backend):

```bash
docker build -f RecursosBackend-Adoptme-main/Dockerfile -t adoptme-api:local RecursosBackend-Adoptme-main
```

Si se trabaja únicamente dentro de `RecursosBackend-Adoptme-main/`, puede utilizarse `docker build -t adoptme-api:local .` en esa carpeta.

## Integración continua

En la raíz del repositorio existe un flujo de **GitHub Actions** (`.github/workflows/docker-publish.yml`) que, ante cambios en la rama `main`, construye la imagen a partir de `RecursosBackend-Adoptme-main/` y la publica en Docker Hub, siempre que estén configurados los secretos `DOCKERHUB_USERNAME` y `DOCKERHUB_TOKEN` en el repositorio.

## Documentación de la API

### Swagger / OpenAPI (módulo Users)

Ruta de la interfaz: **`GET /api-docs`**

Incluye las operaciones bajo el prefijo `/api/users`: listado, consulta por identificador, actualización, eliminación y carga de documentos (multipart, campo `documents`).

### Resumen de demás rutas (referencia rápida)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/pets` | Listado de mascotas |
| POST | `/api/pets` | Alta de mascota |
| POST | `/api/pets/withimage` | Alta con imagen (almacenamiento en subcarpeta `pets`) |
| PUT | `/api/pets/:pid` | Actualización de mascota |
| DELETE | `/api/pets/:pid` | Eliminación de mascota |
| GET | `/api/adoptions` | Listado de adopciones |
| GET | `/api/adoptions/:aid` | Detalle de adopción |
| POST | `/api/adoptions/:uid/:pid` | Registro de adopción |
| POST | `/api/sessions/register` | Registro de usuario |
| POST | `/api/sessions/login` | Inicio de sesión (cookie JWT) |
| POST | `/api/sessions/logout` | Cierre de sesión |
| GET | `/api/sessions/current` | Usuario asociado al token en cookie |
| GET / POST | `/api/sessions/unprotectedLogin`, `/api/sessions/unprotectedCurrent` | Variante de demostración |

## Autor

Proyecto final — Maximiliano Rodrigo Martínez (según repositorio enlazado).
