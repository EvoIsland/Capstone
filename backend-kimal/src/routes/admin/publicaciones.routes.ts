import { FastifyPluginAsync } from "fastify";
import { authenticateToken } from '../../middlewares/auth.middleware';
import { authorizeAdmin } from '../../middlewares/admin.middleware';
import { PublicacionModel } from '../../models/publicacion.model';
import { crearPublicacionSchema } from '../../schemas/publicacion.schema';

const publicacionesRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.addHook('preHandler', authenticateToken);
  fastify.addHook('preHandler', authorizeAdmin);

  // Listar publicaciones
  fastify.get('/admin/publicaciones', async (request, reply) => {
    const publicaciones = await PublicacionModel.find();
    reply.send(publicaciones);
  });

  // Eliminar publicación
  fastify.delete<{ Params: { id: string } }>('/admin/publicaciones/:id', async (request, reply) => {
    await PublicacionModel.findByIdAndDelete(request.params.id);
    reply.send({ success: true });
  });

  // (Opcional) Crear publicación desde admin
  fastify.post('/admin/publicaciones', async (request, reply) => {
    const parseResult = crearPublicacionSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Datos inválidos', detalles: parseResult.error.issues });
    }
    const data = parseResult.data;
    const nuevaPublicacion = new PublicacionModel(data);
    await nuevaPublicacion.save();
    reply.send(nuevaPublicacion);
  });

  // (Opcional) Editar publicación
  fastify.put<{ Params: { id: string } }>('/admin/publicaciones/:id', async (request, reply) => {
    const parseResult = crearPublicacionSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Datos inválidos', detalles: parseResult.error.issues });
    }
    const data = parseResult.data;
    const publicacionActualizada = await PublicacionModel.findByIdAndUpdate(request.params.id, data, { new: true });
    reply.send(publicacionActualizada);
  });
};

export default publicacionesRoutes;