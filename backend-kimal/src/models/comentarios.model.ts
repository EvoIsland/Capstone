import mongoose, { Schema, Document, Types } from "mongoose";


export interface ComentarioDocument extends Document {
    publicacionId: Types.ObjectId;
    usuarioId: Types.ObjectId;
    texto: string;
    respuestaA?: Types.ObjectId;
    fecha:Date;
}

const ComentariosSchema = new Schema<ComentarioDocument>({
    publicacionId: {type: Schema.Types.ObjectId, ref: 'Publicacion', required: true},
    usuarioId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    texto: { type: String, required: true},
    respuestaA: {type: Schema.Types.ObjectId, ref: 'Comentario', default: null },
    fecha: {type: Date, default: Date.now}
});

export const ComentarioModel = mongoose.model<ComentarioDocument>('Comentario', ComentariosSchema);