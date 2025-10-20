import { FastifyPluginAsync } from 'fastify';
import { PublicacionModel } from "../models/publicacion.model";
import { InstalacionModel } from "../models/instalacion.model"
import { crearPublicacionSchema } from "../schemas/publicacion.schema";
import { authenticateToken } from '../middlewares/auth.middleware'; // Asumo que tienes este middleware

const PublicacionRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
 
fastify.post('/publicacion', { preHandler: authenticateToken }, async (request, reply) => {
  try {
    const validationResult = crearPublicacionSchema.safeParse(request.body);
    
    if(!validationResult.success) {
      return reply.status(400).send({
        error: "Datos invalidos",
        details: validationResult.error.flatten(),
      });
    }

    const datosValidados= validationResult.data;
    const userId = request.user?._id;


    //Ejecutar logica de negocio
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
      likes: [],
    })
    
    return reply.status(201).send(nuevaPublicacion)

    } catch (error) {
      console.error('Error al crear publicacion:', error);
      return reply.status(500).send({error: 'Error al crear publicacion.' });
    }
  });

fastify.get('/publicaciones', async (request, reply)=> {
  try{
    const publicaciones = await PublicacionModel.find()
      .sort({fecha:-1})
      .populate('publicadorId', 'nombre')
      .populate('instalacionId', 'nombre')
      .populate('comunaId', 'nombre')
      .populate('regionId', 'nombre')
      .lean()
  reply.send(publicaciones)
  }catch (error){
    console.error('Error en GET /publicaciones:', error)
    reply.status(500).send({ error: 'error al obtener la publicacion'})
  }
})

fastify.post('/publicacion/:id/like', { preHandler: authenticateToken }, async (request, reply) => {
  try {
    const { id: publicacionId } = request.params as { id: string };
    const userId = request.user?._id;

    if (!userId) {
      return reply.status(401).send({ error: 'Usuario no autenticado' });
    }

    const publicacion = await PublicacionModel.findById(publicacionId);
    if (!publicacion) {
      return reply.status(404).send({ error: 'Publicación no encontrada' });
    }

    const index = publicacion.likes.findIndex((id: any) => id.toString() === userId.toString());
    if (index === -1) {
      publicacion.likes.push(userId as any); // Dar like
    } else {
      publicacion.likes.splice(index, 1); // Quitar like
    }

    await publicacion.save();
    reply.send({ likes: publicacion.likes.length });
  } catch (error) {
    reply.status(500).send({ error: 'Error al actualizar Me gusta' });
  }
});

fastify.get('/publicacion/:id/likes', async (request, reply) => {
  try {
    const { id: publicacionId } = request.params as { id: string };
    const publicacion = await PublicacionModel.findById(publicacionId).populate('likes', 'nombre');

    if (!publicacion) {
      return reply.status(404).send({ error: 'Publicación no encontrada' });
    }

    reply.send({
      total: publicacion.likes.length,
      usuarios: publicacion.likes, // Array de usuarios con solo el nombre
    });
  } catch (error) {
    reply.status(500).send({ error: 'Error al obtener los Me gusta' });
  }
});

}

export default PublicacionRoutes;