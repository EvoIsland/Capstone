import { z } from 'zod';

export const crearComentarioSchema = z.object({
  texto: z.string().min(1, 'El comentario no puede estar vacío'),
  respuestaA: z.string().optional(), // ID del comentario padre (opcional)
});