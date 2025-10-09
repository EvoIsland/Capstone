import { FastifyPluginAsync } from "fastify";
import { PasswordResetTokenModel } from "../models/passwordReset.model";
import { UserModel } from "../models/user.model";
import { sendPasswordResetEmail } from '../services/email.service';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const passwordResetRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	// Solicitud de cambio de contraseña
	fastify.post('/request-password-change', async (request, reply) => {
		const { correo } = request.body as { correo: string };

		const user = await UserModel.findOne({ correo });
		// Siempre responde igual por seguridad
		if (!user) {
			return reply.send({ message: 'Si el correo existe, recibirás instrucciones para cambiar tu contraseña' });
		}

		// Generar token y expiración
		const token = crypto.randomBytes(32).toString('hex');
		const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

		// Elimina tokens anteriores del usuario
		await PasswordResetTokenModel.deleteMany({ userId: user._id });

		// Guarda el nuevo token
		await PasswordResetTokenModel.create({
			userId: user._id,
			token,
			expires
		});

		// Envía el correo con el enlace de recuperación
		await sendPasswordResetEmail(user.correo, token);

		return reply.send({ message: 'Si el correo existe, recibirás instrucciones para cambiar tu contraseña' });
	});

	// Cambio de contraseña usando el token
	fastify.post('/change-password', async (request, reply) => {
		const { token, nuevaContraseña, repetirContraseña } = request.body as {
			token: string;
			nuevaContraseña: string;
			repetirContraseña: string;
		};

		if (nuevaContraseña !== repetirContraseña) {
			return reply.status(400).send({ error: 'Las contraseñas no coinciden' });
		}

		// Busca el token
		const resetTokenDoc = await PasswordResetTokenModel.findOne({ token });
		if (!resetTokenDoc || resetTokenDoc.expires < new Date()) {
			return reply.status(400).send({ error: 'El enlace de cambio de contraseña es inválido o expiró' });
		}

		// Actualiza la contraseña del usuario
		const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);
		await UserModel.updateOne(
			{ _id: resetTokenDoc.userId },
			{ $set: { contraseña: hashedPassword } }
		);

		// Elimina el token
		await PasswordResetTokenModel.deleteOne({ _id: resetTokenDoc._id });

		return reply.send({ message: 'Contraseña actualizada exitosamente' });
	});
};

export default passwordResetRoutes;

