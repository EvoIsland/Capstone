import { z } from 'zod';

export const crearPublicacionSchema = z.object({

    //Validacion para que el texto no este vacio
    texto: z.string().min(1, { message:'El texto no puede estar vacio.' }),


    //Validacion para que solo sea de ese tipo de publicacion
    tipo: z.enum(['pregunta', 'reporte', 'noticia'], {
         message: "El tipo de publicacion no es valido"
    }),


    //Validacion para subir imagenes
    imagenes: z.array(
        z.string().url({ message: 'Cada imagen debe ser una URL valida . '}),
    )
    .max(3, {message: "No puedes subir mas de 3 imagenes."})
    .optional(),

    //Validacion para instalacion
    instalacionId: z.string().optional(),

    comunaId: z.string().optional(),

    regionId: z.string().optional(),

});