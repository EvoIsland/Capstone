import { z } from 'zod'

export const userAdminSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  correo: z.string().email(),
  rol: z.enum(['usuario', 'admin']),
  recibirCartas: z.boolean().optional().default(false),
  puebloOriginario: z.boolean().optional().default(false),
  nombrePueblo: z.string().optional(),
  direccion: z.string().optional(),
  // contraseña NO requerida, se autogenera en el backend
})