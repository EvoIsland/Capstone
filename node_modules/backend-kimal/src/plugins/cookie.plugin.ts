import fp from 'fastify-plugin';
import cookie from '@fastify/cookie';

export default fp(async function (fastify) {
    await fastify.register(cookie, {
        secret: process.env.COOKIE_SECRET || 'tu_cookie_secret',
        hook: 'onRequest',
    });
});