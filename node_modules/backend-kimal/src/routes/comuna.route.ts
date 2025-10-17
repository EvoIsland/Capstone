import { FastifyPluginAsync } from "fastify";
import { ComunaModel } from "../models/comuna.model";

const comunasRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/comunas', async (request, reply) => {
        try{
            const comunas = await ComunaModel.find();
            reply.send(comunas)
        } catch (error) {
            console.error("Error al obtener las comunas: ", error);
            reply.status(500).send({ error: "Error interno al obtener las comunas"});
        }
    });
};

export default comunasRoutes;