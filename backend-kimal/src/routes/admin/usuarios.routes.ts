import { FastifyPluginAsync } from "fastify";
import { authenticateToken } from '../../middlewares/auth.middleware'; 
import { authorizeAdmin } from '../../middlewares/admin.middleware';

import { UserModel, IUser } from '../../models/user.model';

// Usa el schema de admin
import { userAdminSchema } from '../../schemas/admin/userAdmin.schema';

import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { sendInitialPasswordEmail } from '../../services/email.service'

const usuariosRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.addHook('preHandler', authenticateToken);
  fastify.addHook('preHandler', authorizeAdmin);

  // Obtener todos los usuarios
  fastify.get('/admin/usuarios', async (request, reply) => {
    const usuarios = await UserModel.find();
    reply.send(usuarios);
  });

  // Crear usuario (usa el schema admin)
  fastify.post('/admin/usuarios', async (request, reply) => {
    const parseResult = userAdminSchema.safeParse(request.body)
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Datos inválidos', detalles: parseResult.error.errors })
    }
    const data = parseResult.data

    // Validación de duplicados
    const existe = await UserModel.findOne({ correo: data.correo })
    if (existe) {
      return reply.status(409).send({ error: 'El correo ya está registrado.' })
    }

    // Generar y hashear contraseña automática
    const plainPassword = crypto.randomBytes(8).toString('hex')
    const hashedPassword = await bcrypt.hash(plainPassword, 10)

    const nuevoUsuario = new UserModel({
      ...data,
      contraseña: hashedPassword
    })
    await nuevoUsuario.save()

    // Enviar correo con la contraseña
    await sendInitialPasswordEmail(nuevoUsuario.correo, plainPassword)

    reply.send(nuevoUsuario)
  })

  // Actualizar usuario
  fastify.put<{ Params: { id: string }; Body: Partial<IUser> }>('/admin/usuarios/:id', async (request, reply) => {
    const usuarioActualizado = await UserModel.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true }
    );
    reply.send(usuarioActualizado);
  });

  // Eliminar usuario
  fastify.delete<{ Params: { id: string } }>('/admin/usuarios/:id', async (request, reply) => {
    await UserModel.findByIdAndDelete(request.params.id);
    reply.send({ success: true });
  });
};

export default usuariosRoutes;