Glocation Test - Gestión de Proyectos

Este proyecto es una aplicación fullstack para gestionar proyectos, con backend en Node.js, PostgreSQL con Sequelize, documentación de API con Swagger, integración de IA generativa para resúmenes y un frontend responsivo que muestra tablas y gráficos.
________________________________________
🔹 Características
Backend
•	API REST para la entidad Proyecto con los siguientes atributos:
o	id, nombre, descripcion, estado, fechaInicio, fechaFin
•	Operaciones CRUD completas:
o	Crear: POST /proyectos
o	Listar: GET /proyectos
o	Obtener por id: GET /proyectos/{id}
o	Actualizar: PUT /proyectos/{id}
o	Eliminar: DELETE /proyectos/{id}
•	Endpoints adicionales:
o	/analisis: genera un resumen de las descripciones usando IA (HuggingFace)
o	/graficos/estadisticas: devuelve cantidad de proyectos por estado
Frontend
•	Interfaz web responsiva:
o	Registro de proyectos
o	Listado de proyectos en tabla
o	Gráfico (pie chart) de distribución de proyectos por estado
o	Resumen generado por IA
•	Compatible con desktop y móvil
________________________________________
🔹 Instalación
1.	Clonar repositorio:
git clone <tu-repo-url>
cd glocation_test
2.	Backend: instalar dependencias
cd backend
npm install
3.	Crear archivo .env:
DATABASE_URL=postgres://postgres:12345678@localhost:5432/proyectos_db
HF_API_KEY=<tu-huggingface-token> # opcional para generar resúmenes
PORT=3000
4.	Inicializar la base de datos (PostgreSQL debe estar corriendo):
npx sequelize-cli db:create
npx sequelize-cli db:migrate
5.	Iniciar servidor:
npm run dev
6.	Frontend: abrir index.html en navegador o servirlo con un servidor local:
cd frontend
live-server
________________________________________
🔹 Documentación de la API (Swagger)
El backend expone documentación Swagger en:
http://localhost:3000/docs
Todos los endpoints están documentados con OpenAPI, incluyendo parámetros, request body y ejemplos de respuestas.
________________________________________
🔹 Endpoints
CRUD de Proyectos
•	Listar todos:
GET /proyectos
Respuesta: [ { id, nombre, descripcion, estado, fechaInicio, fechaFin }, ... ]
•	Obtener por id:
GET /proyectos/{id}
•	Crear proyecto:
POST /proyectos
Body JSON:
•	{
•	  "nombre": "Proyecto 1",
•	  "descripcion": "Descripción del proyecto",
•	  "estado": "En progreso",
•	  "fechaInicio": "2025-10-20",
•	  "fechaFin": "2025-12-20"
•	}
•	Actualizar proyecto:
PUT /proyectos/{id}
Body JSON: igual que en creación
•	Eliminar proyecto:
DELETE /proyectos/{id}
Endpoints adicionales
•	Resumen con IA:
POST /proyectos/analisis
Respuesta:
•	{
•	  "resumen": "Resumen generado por IA en español..."
•	}
•	Estadísticas para gráfico:
GET /proyectos/graficos/estadisticas
Respuesta:
•	[
•	  { "estado": "En progreso", "cantidad": 5 },
•	  { "estado": "Finalizado", "cantidad": 3 }
•	]
________________________________________
🔹 Integración de IA
Se utiliza un modelo de HuggingFace para resumir las descripciones de los proyectos.
•	Endpoint: /analisis
•	Requiere la variable de entorno HF_API_KEY
•	Si no se proporciona, devuelve un mensaje de advertencia y un resumen de ejemplo.
________________________________________
🔹 Frontend
•	Formulario para crear y actualizar proyectos.
•	Tabla con listado de proyectos.
•	Gráfico de distribución por estado (Chart.js).
•	Resumen de IA en <pre>.
Responsive: usa flexbox y CSS para que funcione en móviles y desktop.
________________________________________
🔹 Docker (Opcional)
Si quieres correr todo en contenedores:
docker-compose up --build
Esto levanta:
•	PostgreSQL
•	Backend Node.js
•	Frontend
________________________________________
🔹 Screenshots
Desktop
Móvil
________________________________________
🔹 Decisiones técnicas
•	Node.js + Express para API REST: simple y rápido de configurar.
•	Sequelize como ORM: fácil manejo de PostgreSQL y relaciones.
•	Swagger: documentación automática y fácil de testear.
•	Chart.js: gráfico interactivo en frontend.
•	HuggingFace: generación de resumen en español.
•	Flexbox / CSS: diseño responsivo.







<!-- # Glocation - Test Project (Starter)

## Qué contiene
- backend/: Node.js + Express + Sequelize (Postgres). Endpoints CRUD para `Proyecto`, `/proyectos/analisis` (usa HuggingFace si configuras HF_API_KEY), `/proyectos/graficos/estadisticas`.
- frontend/: Single-file Vue app (CDN) que consume la API y muestra tabla, gráfico y resumen.
- docker-compose.yml para levantar Postgres + backend + frontend.
- Dockerfiles para backend y frontend.

## Arrancar con Docker (recomendado)
1. `docker compose up --build`
2. Backend: http://localhost:3000
3. Swagger UI: http://localhost:3000/docs
4. Frontend: http://localhost:8080

## Trabajar local sin Docker
- Backend:
  - `cd backend`
  - `npm install`
  - configurar `.env` si usas otro DATABASE_URL
  - `npm run dev`
- Frontend:
  - abrir `frontend/index.html` en el navegador (o servir con un simple servidor).

## Notas
- `/proyectos/analisis` devolverá un mensaje de ayuda si no configuras `HF_API_KEY`.
- El esquema de Sequelize se sincroniza automáticamente al iniciar el backend (sequelize.sync()).
- Este repo es un *starter* funcional para que completes y mejores: validaciones, manejo avanzado de errores, seguridad, tests, y diseño. -->
