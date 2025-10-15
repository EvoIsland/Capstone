import { FastifyPluginAsync } from 'fastify';
import { RegionModel } from '../models/region.model';


const regionRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {



    fastify.get('/regiones', async (request, reply) => {
        try {
            const regiones = await RegionModel.find();
            reply.send(regiones);
        } catch (error) {
            console.error("Error al obtener las regiones: ",error);
            reply.status(500).send({ error: "Error interno al obtener las regiones. "})
        }
});

};

export default regionRoutes;