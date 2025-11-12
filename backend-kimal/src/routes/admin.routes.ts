import { FastifyPluginAsync } from "fastify";
import usuariosRoutes from './admin/usuarios.routes';
import publicacionesRoutes from './admin/publicaciones.routes';
// import comentariosRoutes from './admin/comentarios.routes';
// import zonasRoutes from './admin/zonas.routes';

const adminRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  await fastify.register(usuariosRoutes);
  await fastify.register(publicacionesRoutes);
//   await fastify.register(comentariosRoutes);
//   await fastify.register(zonasRoutes);
};

export default adminRoutes;