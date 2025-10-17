import { z } from 'zod';

// Schema para registro de usuario
export const userRegistrationSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    correo: z.string().email("Correo inválido"),
    contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    recibirCartas: z.boolean().optional().default(false),
    puebloOriginario: z.boolean().default(false),
    nombrePueblo: z.string().optional(),
    direccion: z.string().optional()
});

// Schema para login
export const loginSchema = z.object({
    correo: z.string().email("Correo inválido"),
    contraseña: z.string()
});

// Schema para cambio de contraseña
export const changePasswordSchema = z.object({
    correo: z.string().email("Correo inválido"),
    nuevaContraseña: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres")
});

// Schema para solicitud de cambio de contraseña
export const requestPasswordChangeSchema = z.object({
    correo: z.string().email("Correo inválido")
});

// Tipos TypeScript inferidos de los schemas
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserLogin = z.infer<typeof loginSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
export type RequestPasswordChange = z.infer<typeof requestPasswordChangeSchema>;
