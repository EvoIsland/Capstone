import {z} from 'zod';

export const crearNoticiaSchema = z.object({
    titulo: z.string(),
    texto: z.string(),
    tipo: z.literal('noticia'),
    imagenes: z.array(z.string().url()).optional(),
    instalacionId: z.string().optional(),
    comunaId: z.string().optional(),
    regionId: z.string().optional(),
    contentJson: z.array(z.any()) // <-- requerido para el editor visual
})