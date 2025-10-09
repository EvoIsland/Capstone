import { join } from 'node:path'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify'
import cors from '@fastify/cors'
import { connectDB } from './config/database'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {
  // Puedes agregar opciones personalizadas aquí
}

// Opciones por defecto
const options: AppOptions = {
  logger: true
}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {

  // Configurar CORS para cualquier origen (debe ir antes de todo)
  await fastify.register(cors, {
    origin: true,
    credentials: true
  })

  // Conectar a la base de datos
  await connectDB()

  // Configurar TypeBox para validación de tipos
  fastify.withTypeProvider<TypeBoxTypeProvider>()


  // Cargar plugins automáticamente
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  // Log de archivos de rutas
  const fs = require('fs');
  const routesDir = join(__dirname, 'routes');
  const routeFiles = fs.readdirSync(routesDir);
  fastify.log.info('Archivos de rutas encontrados:');
  routeFiles.forEach((file: string) => fastify.log.info(file));

  // Cargar rutas automáticamente
  void fastify.register(AutoLoad, {
    dir: routesDir,
    options: opts
  })



  // Mostrar todas las rutas registradas al iniciar
  fastify.ready().then(() => {
    fastify.printRoutes();
  });

  // Manejo de errores no capturados
  process.on('unhandledRejection', (err: Error) => {
    fastify.log.error('Error no manejado: ' + err.message)
    process.exit(1)
  })
}

export default app
export { app, options }
