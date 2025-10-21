import { Sequelize, DataTypes } from 'sequelize';

const DATABASE_URL = process.env.DATABASE_URL;
export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres', // 👈 ESTA LÍNEA ES CLAVE
  logging: false
});

export const Proyecto = sequelize.define('Proyecto', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  estado: {
    type: DataTypes.ENUM({
      values: ['En progreso', 'Finalizado']
    }),
    allowNull: false
  },
  fechaInicio: { type: DataTypes.DATE },
  fechaFin: { type: DataTypes.DATE }
});

// Opcional: sincronizar modelos (solo para desarrollo, no producción)
export async function syncModels() {
  try {
    // Evitar recrear tablas que ya existen y enums duplicados
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados correctamente.');
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
}