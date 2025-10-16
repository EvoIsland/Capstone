import { z } from 'zod';

export const crearPublicacionSchema = z.object({
    texto: z.string().min(1),
    tipo: z.enum(['pregunta', 'reporte', 'noticia'], {
         message: "El tipo de publicacion no es valido"
    }),
    imagenes: z.array(
        z.string().url(),
    )
    .max(3, {message: "No puedes subir mas de 3 imagenes."})
    .optional(),
    instalacionId: z.string().optional(),
    comunaId: z.string().optional(),
    regionId: z.string().optional(),
});