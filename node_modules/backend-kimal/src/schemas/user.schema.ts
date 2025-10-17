import { z } from 'zod';

export const userSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  correo: z.string().email(),
  contraseña: z.string(),
  recibirCartas: z.boolean().default(false),
  puebloOriginario: z.boolean().default(false),
  nombrePueblo: z.string().optional(),
  direccion: z.string().optional()
});

export type CreateUserInput = z.infer<typeof userSchema>;
