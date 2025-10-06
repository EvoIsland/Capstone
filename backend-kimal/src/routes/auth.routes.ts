import { FastifyPluginAsync } from 'fastify';
import { 
    userRegistrationSchema, 
    loginSchema, 
    changePasswordSchema, 
    requestPasswordChangeSchema,
    type UserRegistration,
    type UserLogin,
    type ChangePassword,
    type RequestPasswordChange
} from '../schemas/auth.schema';

import { UserModel } from '../models/user.model';
import { authenticateToken } from '../middlewares/auth.middleware';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../services/email.service';
import crypto from 'crypto';

const authRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    // Registro de usuario
    fastify.post<{ Body: UserRegistration }>('/register', async (request, reply) => {
        try {
            const userData = userRegistrationSchema.parse(request.body);
            
            // Verificar si el usuario ya existe
            const existingUser = await UserModel.findOne({ correo: userData.correo });
            if (existingUser) {
                return reply.status(400).send({ error: 'El correo ya está registrado' });
            }

            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(userData.contraseña, 10);


            // Generar token de verificación
            const verificationToken = crypto.randomBytes(32).toString('hex');

            // Crear nuevo usuario con verificado: false y tokenVerificacion
            const newUser = new UserModel({
                ...userData,
                contraseña: hashedPassword,
                verificado: false,
                tokenVerificacion: verificationToken
            });

            await newUser.save();

            // Enviar correo de verificación
            await sendVerificationEmail(userData.correo, verificationToken);

            return reply.status(201).send({ 
                message: 'Usuario registrado exitosamente. Por favor verifica tu correo electrónico.'
            });

        } catch (error) {
            if (error instanceof Error) {
                return reply.status(400).send({ error: error.message });
            }
            return reply.status(500).send({ error: 'Error interno del servidor' });
        }
    });


    // Ruta para verificar cuenta (asegurar parámetro dinámico)
    fastify.get('/verify/:token', async (request, reply) => {
        try {
            const { token } = request.params as { token: string };
            // Buscar usuario con el token de verificación
            const user = await UserModel.findOne({ tokenVerificacion: token });
            if (!user) {
                return reply.status(400).send({ 
                    error: 'Token de verificación inválido o expirado' 
                });
            }
            // Actualizar usuario como verificado
            await UserModel.updateOne(
                { _id: user._id },
                { 
                    $set: { verificado: true },
                    $unset: { tokenVerificacion: 1 }
                }
            );
            return reply.send({ 
                message: 'Cuenta verificada exitosamente. Ahora puedes iniciar sesión.' 
            });
        } catch (error) {
            if (error instanceof Error) {
                return reply.status(400).send({ error: error.message });
            }
            return reply.status(500).send({ error: 'Error interno del servidor' });
        }
    });


    // Login
    fastify.post<{ Body: UserLogin }>('/login', async (request, reply) => {
        try {
            console.log('Request body:', request.body); // Debugging
            const loginData = loginSchema.parse(request.body);

            // Buscar usuario
            const user = await UserModel.findOne({ correo: loginData.correo });
            if (!user) {
                return reply.status(401).send({ error: 'Credenciales inválidas' });
            }


            // Verificar si el usuario está verificado
            if (!user.verificado) {
                return reply.status(401).send({ 
                    error: 'Por favor verifica tu cuenta antes de iniciar sesión. Revisa tu correo electrónico.'
                });
            }

            // Verificar contraseña
            const isValidPassword = await bcrypt.compare(loginData.contraseña, user.contraseña);
            if (!isValidPassword) {
                return reply.status(401).send({ error: 'Credenciales inválidas' });
            }


            // Generar token inicial
            const token = jwt.sign(
                { userId: user._id.toString() },
                process.env.JWT_SECRET || 'tu_jwt_secret',
                { expiresIn: '24h' }
            );

            // Configurar cookie segura con el token
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax' as const,  // Cambiado a 'lax' para desarrollo
                path: '/',
                maxAge: 24 * 60 * 60 * 1000 // 24 horas
            };
            
            console.log('Setting cookie with options:', cookieOptions); // Debugging
            reply.setCookie('refreshToken', token, cookieOptions);

            return reply.send({ 
                token,
                user: {
                    id: user._id.toString(),
                    nombre: user.nombre,
                    apellido: user.apellido,
                    correo: user.correo
                }
            });

        } catch (error) {
            if (error instanceof Error) {
                return reply.status(400).send({ error: error.message });
            }
            return reply.status(500).send({ error: 'Error interno del servidor' });
        }
    });

    // Solicitar cambio de contraseña
    fastify.post<{ Body: RequestPasswordChange }>('/request-password-change', async (request, reply) => {
        try {
            const { correo } = requestPasswordChangeSchema.parse(request.body);

            const user = await UserModel.findOne({ correo });
            if (!user) {
                // Por seguridad, no revelamos si el correo existe o no
                return reply.send({ 
                    message: 'Si el correo existe, recibirás instrucciones para cambiar tu contraseña' 
                });
            }

            // Aquí iría la lógica para enviar el correo con el link de cambio de contraseña
            // Por ahora solo simulamos el proceso

            return reply.send({ 
                message: 'Si el correo existe, recibirás instrucciones para cambiar tu contraseña' 
            });

        } catch (error) {
            if (error instanceof Error) {
                return reply.status(400).send({ error: error.message });
            }
            return reply.status(500).send({ error: 'Error interno del servidor' });
        }
    });

    // Cambiar contraseña (ruta protegida)
    fastify.post<{ Body: ChangePassword }>(
        '/change-password',
        { onRequest: [authenticateToken] },
        async (request, reply) => {
        try {
            const { correo, nuevaContraseña } = changePasswordSchema.parse(request.body);

            const user = await UserModel.findOne({ correo });
            if (!user) {
                return reply.status(404).send({ error: 'Usuario no encontrado' });
            }

            // Hash de la nueva contraseña
            const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);
            
            // Actualizar contraseña
            await UserModel.updateOne(
                { _id: user._id },
                { $set: { contraseña: hashedPassword }}
            );

            return reply.send({ message: 'Contraseña actualizada exitosamente' });

        } catch (error) {
            if (error instanceof Error) {
                return reply.status(400).send({ error: error.message });
            }
            return reply.status(500).send({ error: 'Error interno del servidor' });
        }
    });
}
export default authRoutes;
