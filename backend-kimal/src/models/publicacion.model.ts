import mongoose, { Schema, Document, Types } from 'mongoose';

export interface PublicacionDocument extends Document {
    publicadorId: Types.ObjectId;
    texto: string;
    tipo: 'pregunta'| 'reporte' | 'noticia';
    imagenes: string[];
    fecha: Date;
    instalacionId?: Types.ObjectId;
    comunaId?: Types.ObjectId;
    regionId?: Types.ObjectId;
    likes: Types.ObjectId[]; 
}

const PublicacionSchema = new Schema<PublicacionDocument>({
    publicadorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    texto: { type: String, required: true },
    tipo: { type: String, enum: ['pregunta','reporte','noticia'], required: true},
    imagenes: { type: [String], default: [],maxLength:3 },
    fecha: {type: Date, default: Date.now},
    instalacionId: { type: Schema.Types.ObjectId, ref: 'Instalacion'},
    comunaId: { type: Schema.Types.ObjectId, ref: 'Comuna'},
    regionId: { type: Schema.Types.ObjectId, ref: 'Region'},
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: []}],
});

export const PublicacionModel = mongoose.model<PublicacionDocument>('Publicacion', PublicacionSchema);