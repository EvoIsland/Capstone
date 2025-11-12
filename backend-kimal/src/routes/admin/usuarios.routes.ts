import { FastifyPluginAsync } from "fastify";
import { authenticateToken } from '../../middlewares/auth.middleware'; 
import { authorizeAdmin } from '../../middlewares/admin.middleware';
import { UserModel, IUser } from '../../models/user.model';

import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { sendInitialPasswordEmail } from '../../services/email.service'

const usuariosRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.addHook('preHandler', authenticateToken); // <-- primero
  fastify.addHook('preHandler', authorizeAdmin);    // <-- después

  // Obtener todos los usuarios
  fastify.get('/admin/usuarios', async (request, reply) => {
    const usuarios = await UserModel.find();
    reply.send(usuarios);
  });

  // Crear usuario
  fastify.post<{ Body: Partial<IUser> }>('/admin/usuarios', async (request, reply) => {
    const plainPassword = crypto.randomBytes(8).toString('hex')
    const hashedPassword = await bcrypt.hash(plainPassword, 10)

    const nuevoUsuario = new UserModel({
      ...request.body,
      contraseña: hashedPassword
    })
    await nuevoUsuario.save()

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