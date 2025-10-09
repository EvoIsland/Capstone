import { FastifyPluginAsync } from 'fastify';
import { InstalacionModel } from '../models/instalacion.model';
import { ComunaModel } from '../models/comuna.model';
import { RegionModel } from '../models/region.model';

const instalacionesRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Obtener todas las instalaciones
  fastify.get('/instalaciones', async (request, reply) => {
    const instalaciones = await InstalacionModel.find();
    reply.send(instalaciones);
  });

  // Obtener todas las comunas
  fastify.get('/comunas', async (request, reply) => {
    const comunas = await ComunaModel.find();
    reply.send(comunas);
  });

  // Obtener todas las regiones
  fastify.get('/regiones', async (request, reply) => {
    const regiones = await RegionModel.find();
    reply.send(regiones);
  });
};

export default instalacionesRoutes;
