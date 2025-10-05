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
  // Conectar a la base de datos
  await connectDB()

  // Configurar TypeBox para validación de tipos
  fastify.withTypeProvider<TypeBoxTypeProvider>()

  // Configurar CORS
  await fastify.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  })

  // Cargar plugins automáticamente
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  // Cargar rutas automáticamente
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  })

  // Manejo de errores no capturados
  process.on('unhandledRejection', (err: Error) => {
    fastify.log.error('Error no manejado: ' + err.message)
    process.exit(1)
  })
}

export default app
export { app, options }
