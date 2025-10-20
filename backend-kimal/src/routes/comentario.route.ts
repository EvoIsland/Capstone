import { FastifyPluginAsync } from 'fastify';
import { ComentarioModel } from '../models/comentario.model';
import { crearComentarioSchema } from '../schemas/comentario.schema';
import { authenticateToken } from '../middlewares/auth.middleware';

const ComentarioRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  // Crear comentario o respuesta
  fastify.post('/publicacion/:id/comentario', { preHandler: authenticateToken }, async (request, reply) => {
    const validationResult = crearComentarioSchema.safeParse(request.body);
    if (!validationResult.success) {
      return reply.status(400).send({
        error: "Datos inválidos",
        details: validationResult.error.flatten(),
      });
    }
    const { texto, respuestaA } = validationResult.data;
    const usuarioId = request.user?._id;
    const publicacionId = (request.params as any).id;

    if (!usuarioId) {
      return reply.status(401).send({ error: 'Usuario no autenticado' });
    }

    const nuevoComentario = await ComentarioModel.create({
      publicacionId,
      usuarioId,
      texto,
      respuestaA: respuestaA || null
    });

    reply.status(201).send(nuevoComentario);
  });

  // Obtener comentarios y respuestas en árbol
  fastify.get('/publicacion/:id/comentarios', async (request, reply) => {
    const publicacionId = (request.params as any).id;
    const comentarios = await ComentarioModel.find({ publicacionId })
      .populate('usuarioId', 'nombre')
      .lean();

    const comentariosRaiz = comentarios.filter(c => !c.respuestaA);
    const respuestas = comentarios.filter(c => c.respuestaA);

    const mapRespuestas = (comentario: any) => ({
      ...comentario,
      respuestas: respuestas.filter(r => r.respuestaA?.toString() === comentario._id.toString()).map(mapRespuestas)
    });

    const comentariosConRespuestas = comentariosRaiz.map(mapRespuestas);

    reply.send(comentariosConRespuestas);
  });
};

export default ComentarioRoutes;