import { FastifyPluginAsync } from 'fastify';
import { PublicacionModel } from "../models/publicacion.model";
import { InstalacionModel } from "../models/instalacion.model";
import { crearPublicacionSchema } from "../schemas/publicacion.schema";
import { authenticateToken } from '../middlewares/auth.middleware';
import fs from 'fs';
import path from 'path';

const PublicacionRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.register(require('@fastify/multipart'));

  fastify.post('/publicacion', { preHandler: authenticateToken }, async (request: any, reply) => {
    try {
      const imagenes: string[] = [];
      const campos: Record<string, any> = {};
      const parts = request.parts();

      for await (const part of parts) {
        if (part.file) {
          const buffer = await part.toBuffer();
          const filename = Date.now() + '-' + part.filename;
          const uploadPath = path.join(__dirname, '../../uploads', filename);
          fs.writeFileSync(uploadPath, buffer);
          imagenes.push(`/uploads/${filename}`);
        } else {
          campos[part.fieldname] = part.value;
        }
      }

      const datosParaValidar = {
        ...campos,
        imagenes,
      };

      const validationResult = crearPublicacionSchema.safeParse(datosParaValidar);

      if (!validationResult.success) {
        return reply.status(400).send({
          error: "Datos invalidos",
          details: validationResult.error.flatten(),
        });
      }

      const datosValidados = validationResult.data;
      const userId = request.user?._id;

      let finalComunaId = datosValidados.comunaId;
      let finalRegionId = datosValidados.regionId;

      if (datosValidados.tipo === 'reporte') {
        if (!datosValidados.instalacionId) {
          return reply.status(400).send({ error: 'La ID de instalacion especificada no fue encontrada.' });
        }

        const instalacion = await InstalacionModel.findById(datosValidados.instalacionId);
        if (!instalacion) {
          return reply.status(404).send({ error: 'La instalacion especifica no fue encontrada' });
        }

        finalComunaId = datosValidados.comunaId?.toString();
        finalRegionId = datosValidados.regionId?.toString();
      }

      const nuevaPublicacion = await PublicacionModel.create({
        publicadorId: userId,
        tipo: datosValidados.tipo,
        texto: datosValidados.texto,
        imagenes: datosValidados.imagenes || [],
        instalacionId: datosValidados.instalacionId,
        comunaId: finalComunaId,
        regionId: finalRegionId,
      });

      return reply.status(201).send(nuevaPublicacion);

    } catch (error) {
      console.error('Error al crear publicacion:', error);
      return reply.status(500).send({ error: 'Error al crear publicacion.' });
    }
  });

  fastify.get('/publicaciones', async (request, reply) => {
    try {
      const publicaciones = await PublicacionModel.find()
        .sort({ fecha: -1 })
        .populate('publicadorId', 'nombre')
        .populate('instalacionId', 'nombre')
        .populate('comunaId', 'nombre')
        .populate('regionId', 'nombre')
        .lean();
      reply.send(publicaciones);
    } catch (error) {
      console.error('Error en GET /publicaciones:', error);
      reply.status(500).send({ error: 'error al obtener la publicacion' });
    }
  });
};

export default PublicacionRoutes;