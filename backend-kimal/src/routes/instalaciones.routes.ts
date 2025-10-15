import { FastifyPluginAsync } from 'fastify';
import { InstalacionModel } from '../models/instalacion.model';


const instalacionesRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  fastify.get('/instalaciones', async (request, reply) => {
    try{
      const instalaciones = await InstalacionModel.find();
      reply.send(instalaciones);
    } catch (error) {
        console.error("Error al obtener las instalaciones: ", error);
        reply.status(500).send({ error: "Error interno al obtener las instalaciones"});
    }


  });
};

export default instalacionesRoutes;
