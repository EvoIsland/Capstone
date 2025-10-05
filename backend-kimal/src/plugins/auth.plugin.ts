import { FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';

export async function configurePlugins(fastify: FastifyInstance) {
    // Configurar CORS
    await fastify.register(cors, {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true
    });

    // Configurar Cookies
    await fastify.register(cookie, {
        secret: process.env.COOKIE_SECRET || 'tu_cookie_secret', // Para cookies firmadas
        hook: 'onRequest',
    });
}
