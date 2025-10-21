import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sequelize, syncModels } from './models/index.js';
import proyectosRouter from './routes/proyectos.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración de __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Sincronizar modelos al iniciar
syncModels();

// Swagger setup
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Glocation Test API",
      version: "1.0.0",
      description: "Documentación de la API de Glocation Test"
    }
  },
  apis: [path.join(__dirname, "/routes/*.js")],
};
const openapiSpecification = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// Rutas
app.use('/proyectos', proyectosRouter);

// Iniciar servidor
const PORT = process.env.PORT;
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    await sequelize.sync(); // Sincronizar modelos con la DB
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

start();
