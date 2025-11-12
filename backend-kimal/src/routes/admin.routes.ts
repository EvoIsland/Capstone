import { FastifyPluginAsync } from "fastify";
import usuariosRoutes from './admin/usuarios.routes';
import publicacionesRoutes from './admin/publicaciones.routes';


import instalacionRoutes from "./admin/instalacion.routes";

const adminRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  await fastify.register(usuariosRoutes);
  await fastify.register(publicacionesRoutes);
  await fastify.register(instalacionRoutes);
};

export default adminRoutes;