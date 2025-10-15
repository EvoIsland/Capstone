import { FastifyPluginAsync } from 'fastify';
import { PublicacionModel } from "../models/publicacion.model";
import { InstalacionModel } from "../models/instalacion.model"
import { crearPublicacionSchema } from "../schemas/publicacion.schema";
import { authenticateToken } from '../middlewares/auth.middleware'; // Asumo que tienes este middleware

const PublicacionRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
 
  fastify.post('/publicacion', { preHandler: authenticateToken }, async (request, reply) => {
    try {
      // 1 Validar los datos con zod
      const validationResult = crearPublicacionSchema.safeParse(request.body);
      
      if(!validationResult.success) {
        //Si los datos no cumplesn las reglas, rechazamos la peticion con un error 400
        return reply.status(400).send({
          error: "Datos invalidos",
          details: validationResult.error.flatten(),
        });
      }

      //Si llega aqui, los datos son validos y seguros
      const datosValidados= validationResult.data;
      const userId = request.user?._id; //Obtenemos el id del usuario del token


      //Ejecutar logica de negocio
      let finalComunaId = datosValidados.comunaId;
      let finalRegionId = datosValidados.regionId;


      if (datosValidados.tipo === 'reporte') {
        // la instalación es obligatoria en los reportes 
        if (!datosValidados.instalacionId) {
            return reply.status(400).send({ error: 'La ID de instalacion especificada no fue encontrada.' });
        }

        // la instalación debe de existir
        const instalacion = await InstalacionModel.findById(datosValidados.instalacionId);
        if (!instalacion) {
            return reply.status(404).send({ error: 'La instalacion especifica no fue encontrada' });
        }

        // usamos la comuna y región de la instalación
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
      })
      
      return reply.status(201).send(nuevaPublicacion)
  
      } catch (error) {
        console.error('Error al crear publicacion:', error);
        return reply.status(500).send({error: 'Error al crear publicacion.' });
      }
    });

}

export default PublicacionRoutes;