import { FastifyPluginAsync } from 'fastify';
import { NoticiaModel } from '../models/noticia.model'; // <-- usa el modelo correcto
import { crearNoticiaSchema } from '../schemas/noticia.schema'; 
import { authenticateToken } from '../middlewares/auth.middleware';
import { authorizeAdmin } from '../middlewares/admin.middleware';

const noticiaRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  fastify.post('/noticia', { 
    preHandler: [authenticateToken, authorizeAdmin] 
  }, async (request, reply) => {
    try {
      const validationResult = crearNoticiaSchema.safeParse(request.body);

      if (!validationResult.success) {
        return reply.status(400).send({
          error: "Datos de la noticia inválidos",
          details: validationResult.error.flatten(),
        });
      }

      const datosValidados = validationResult.data;
      const userId = request.user?._id; 

      const nuevaNoticia = await NoticiaModel.create({
        autorId: userId,
        titulo: datosValidados.titulo,
        texto: datosValidados.texto,
        tipo: datosValidados.tipo,
        instalacionId: datosValidados.instalacionId,
        comunaId: datosValidados.comunaId,
        regionId: datosValidados.regionId,
        imagenes: datosValidados.imagenes || [],
        contentJson: datosValidados.contentJson, // <-- guarda el contenido flexible
      });

      return reply.status(201).send(nuevaNoticia);

    } catch (error) {
      console.error('Error al crear la noticia:', error);
      return reply.status(500).send({ error: 'Error interno del servidor.' });
    }
  });

fastify.get('/noticia/:id', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const noticia = await NoticiaModel.findById(id);
    if (!noticia) return reply.status(404).send({ error: 'Noticia no encontrada' });
    return noticia;
  } catch (error) {
    return reply.status(500).send({ error: 'Error interno del servidor.' });
  }
});

fastify.put('/noticia/:id', { preHandler: [authenticateToken, authorizeAdmin] }, async (request, reply) => {
  try {
    const validationResult = crearNoticiaSchema.safeParse(request.body);
    if (!validationResult.success) {
      return reply.status(400).send({ error: "Datos inválidos", details: validationResult.error.flatten() });
    }
    const { id } = request.params as { id: string };
    const noticia = await NoticiaModel.findByIdAndUpdate(id, validationResult.data, { new: true });
    if (!noticia) return reply.status(404).send({ error: 'Noticia no encontrada' });
    return noticia;
  } catch (error) {
    return reply.status(500).send({ error: 'Error interno del servidor.' });
  }
});

fastify.delete('/noticia/:id', { preHandler: [authenticateToken, authorizeAdmin] }, async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const noticia = await NoticiaModel.findByIdAndDelete(id);
    if (!noticia) return reply.status(404).send({ error: 'Noticia no encontrada' });
    return { ok: true };
  } catch (error) {
    return reply.status(500).send({ error: 'Error interno del servidor.' });
  }
});

};

export default noticiaRoutes;