import { FastifyPluginAsync } from 'fastify';
import { PublicacionModel } from '../models/publicacion.model';
import { InstalacionModel } from '../models/instalacion.model';
import { authenticateToken } from '../middlewares/auth.middleware';
import fastifyMultipart from '@fastify/multipart';
import { join } from 'path';

const publicacionRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  await fastify.register(fastifyMultipart);

  // Crear publicación
  fastify.post('/publicacion', { preHandler: authenticateToken }, async (request, reply) => {
    try {
      let body: any = {};
      let imagenes: string[] = [];
      if (request.isMultipart()) {
        const parts = request.parts();
        for await (const part of parts) {
          if (part.type === 'file' && part.fieldname === 'imagenes') {
            const filename = `${Date.now()}_${part.filename}`;
            const savePath = join(__dirname, '../../public/uploads', filename);
            await part.file.pipe(require('fs').createWriteStream(savePath));
            imagenes.push(`/uploads/${filename}`);
          } else if (part.type === 'field') {
            body[part.fieldname] = part.value;
          }
        }
      } else {
        body = request.body;
        imagenes = body.imagenes || [];
      }
      const { tipo, texto, instalacionId, comunaId, regionId } = body;
      if (!tipo || !texto) {
        return reply.status(400).send({ error: 'Tipo y texto son obligatorios.' });
      }
      if (imagenes.length > 3) {
        return reply.status(400).send({ error: 'Máximo 3 imágenes permitidas.' });
      }
      let finalComunaId = comunaId;
      let finalRegionId = regionId;
      if (tipo === 'reporte') {
        if (!instalacionId) {
          return reply.status(400).send({ error: 'La instalación es obligatoria para reportes.' });
        }
        const instalacion = await InstalacionModel.findById(instalacionId);
        if (!instalacion) {
          return reply.status(400).send({ error: 'Instalación no encontrada.' });
        }
        finalComunaId = instalacion.comunaId;
        finalRegionId = instalacion.regionId;
      }
      const userId = request.user?._id;
      if (!userId) {
        return reply.status(401).send({ error: 'No autenticado.' });
      }
      const nuevaPublicacion = await PublicacionModel.create({
        publicadorId: userId,
        tipo,
        texto,
        imagenes,
        instalacionId,
        comunaId: finalComunaId,
        regionId: finalRegionId
      });
      return reply.send(nuevaPublicacion);
    } catch (error) {
      return reply.status(500).send({ error: 'Error al crear la publicación.' });
    }
  });

  // Obtener publicaciones (feed general)
  fastify.get('/publicaciones', async (request, reply) => {
    try {
      const publicaciones = await PublicacionModel.find().sort({ fecha: -1 }).limit(50);
      return reply.send(publicaciones);
    } catch (error) {
      return reply.status(500).send({ error: 'Error al obtener publicaciones.' });
    }
  });

  // Puedes agregar más endpoints para feeds filtrados, siguiendo, noticias, etc.
};

export default publicacionRoutes;
