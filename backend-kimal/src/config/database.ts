import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/conexionesKimal';

export async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      // Estas opciones son para asegurar una conexión estable
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB conectada: ${conn.connection.host}`);

    // Manejador de eventos para cuando la conexión se pierde
    mongoose.connection.on('error', (err) => {
      console.error('Error de MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB desconectada, intentando reconectar...');
      setTimeout(connectDB, 5000); // Intenta reconectar después de 5 segundos
    });

    // Manejador para señales de terminación
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Conexión a MongoDB cerrada');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
}
