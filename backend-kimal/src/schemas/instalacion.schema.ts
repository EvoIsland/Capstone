import { z } from 'zod'

export const instalacionSchema = z.object({
  nombre: z.string(),
  direccion: z.string(),
  comunaId: z.string(), // Debe ser un ObjectId válido
  regionId: z.string(), // Debe ser un ObjectId válido
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()])
  })
  // Si quieres agregar tipo, descripción, imágenes:
  // tipo: z.string().optional(),
  // descripcion: z.string().optional(),
  // imagenes: z.array(z.string()).optional()
})