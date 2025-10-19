import { FastifyRequest, FastifyReply } from 'fastify';


export const authorizeAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = request.user;

  if (!user || user.rol !== 'admin') {
    return reply.status(403).send({ error: 'Acceso denegado. Se requiere permiso de administrador.' });
  }
};