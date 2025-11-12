import { FastifyPluginAsync } from "fastify";
import { authenticateToken } from '../../middlewares/auth.middleware';
import { authorizeAdmin } from '../../middlewares/admin.middleware';
import { InstalacionModel } from '../../models/instalacion.model';
import { instalacionSchema } from '../../schemas/instalacion.schema';

const instalacionRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.addHook('preHandler', authenticateToken);
  fastify.addHook('preHandler', authorizeAdmin);

  // Listar instalaciones
  fastify.get('/admin/instalaciones', async (request, reply) => {
    const instalaciones = await InstalacionModel.find();
    reply.send(instalaciones);
  });

  // Crear instalación
  fastify.post('/admin/instalaciones', async (request, reply) => {
    const parseResult = instalacionSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Datos inválidos', detalles: parseResult.error.issues });
    }
    const data = parseResult.data;
    const nuevaInstalacion = new InstalacionModel(data);
    await nuevaInstalacion.save();
    reply.send(nuevaInstalacion);
  });

  // Editar instalación
  fastify.put<{ Params: { id: string } }>('/admin/instalaciones/:id', async (request, reply) => {
    const parseResult = instalacionSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Datos inválidos', detalles: parseResult.error.issues });
    }
    const data = parseResult.data;
    const instalacionActualizada = await InstalacionModel.findByIdAndUpdate(request.params.id, data, { new: true });
    reply.send(instalacionActualizada);
  });

  // Eliminar instalación
  fastify.delete<{ Params: { id: string } }>('/admin/instalaciones/:id', async (request, reply) => {
    await InstalacionModel.findByIdAndDelete(request.params.id);
    reply.send({ success: true });
  });
};

export default instalacionRoutes;