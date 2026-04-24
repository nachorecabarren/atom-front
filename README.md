--------------------- ATOM CHALLENGE ---------------------

App de lista de tareas construida con Angular 17 en el front y Node.js + Express + TypeScript en el back, usando Firebase.

# Stack

- Frontend: Angular 17
- Backend: Node.js + Express + TypeScript
- Base de datos: Firebase Firestore
- Auth: JWT con cookies HttpOnly
- Deploy: Firebase Hosting (front) + Cloud Functions (back)


# Arquitectura del backend

El backend sigue una arquitectura DDD (Domain Driven Design) en tres capas:

- Domain:  entidades (`User`, `Task`) con sus factories e interfaces de repositorios. No depende de nada externo.
- Application:  servicios con la lógica de negocio (`UserService`, `TaskService`). Solo conoce las interfaces del dominio.
- Infrastructure:  implementaciones concretas de Firestore, controllers, middlewares y rutas.

También se aplicaron los patrones Repository, Factory y Singleton para la conexión a Firestore.

# Endpoints de la API

- GET /users/:email - Busca un usario por email - No necesita auth
- POST /users - Crea un nuevo usario - No necesita auth
- POST /users/logout - Cierra sesion del usario - No necesita auth

- GET /tasks/users/:userId - Devuelve una lista de tareas (tasks) de un usuario especifico - Necesita auth
- POST /tasks - Crea una nueva tarea - Necesita auth
- PUT /tasks/:id - Edita una tarea (nombre y descripcion) - Necesita auth
- PUT /tasks/:id/status - Edita el estado de una tarea (pending o completed) - Necesita auth
- DELETE /tasks/:id - Elimina una tarea - Necesita auth


# Seguridad

- JWT generado al login/register, almacenado en cookie HttpOnly
- `authMiddleware` verifica el token en cada request a `/tasks`
- CORS configurado por origen permitido
- En producción la cookie usa `secure: true` y `sameSite: none`

# Adicionales cambios de diseño

- Se usó `SameSite=none` en la cookie porque el frontend y backend están en dominios distintos en producción
- El `userId` se guarda en memoria (servicio Angular) en vez de localStorage para evitar exposición innecesaria
- Se usó `takeUntilDestroyed` en todos los componentes para evitar memory leaks
- Las rutas de Angular usan lazy loading para optimizar el bundle inicial
- El proxy de Angular solo se usa en desarrollo para evitar problemas de CORS con el emulador

# Como ejecutar localmente

# Backend
cd atom-api/functions
npm install
firebase emulators:start

API disponible en: `http://127.0.0.1:5001/atom-challenge-a52c7/us-central1`

# Frontend
cd atom-front
npm install
ng serve

App disponible en: `http://localhost:4200`
