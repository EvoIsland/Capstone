import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';

interface TokenPayload {
    userId: string;
    iat: number;
    exp: number;
}

export async function authenticateToken(request: FastifyRequest, reply: FastifyReply) {
    try {
        const authHeader = request.headers.authorization;
        const token = authHeader?.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET || 'tu_jwt_secret'
        ) as TokenPayload;

        // Verificar si el usuario existe
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Añadir el usuario a la request para uso posterior
        request.user = {
            id: user._id.toString(),
            nombre: user.nombre,
            apellido: user.apellido,
            correo: user.correo
        };

        // Verificar si el token está próximo a expirar (menos de 1 hora)
        const horaParaExpirar = decoded.exp - Math.floor(Date.now() / 1000);
        if (horaParaExpirar < 3600) {
            const newToken = generateRefreshToken(user._id.toString());
            reply.header('New-Token', newToken);
        }

    } catch (error) {
        reply.code(401).send({ 
            error: 'No autorizado',
            message: error instanceof Error ? error.message : 'Error de autenticación'
        });
    }
}

export function generateRefreshToken(userId: string): string {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'tu_jwt_secret',
        { expiresIn: '24h' }
    );
}

// Declaración de tipos para extender FastifyRequest
declare module 'fastify' {
    interface FastifyRequest {
        user?: {
            id: string;
            nombre: string;
            apellido: string;
            correo: string;
        };
    }
}
