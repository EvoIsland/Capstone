import mongoose, { Schema, Document, Types } from 'mongoose';

export interface NoticiaDocument extends Document {
    autorId: Types.ObjectId;
    titulo: string;
    texto: string;
    tipo: 'noticia';
    imagenes: string[];
    fecha: Date;
    instalacionId?: Types.ObjectId;
    comunaId?: Types.ObjectId;
    regionId?: Types.ObjectId;
    contentJson: any[]; // El contenido flexible del editor
}

const NoticiaSchema = new Schema<NoticiaDocument>({
    autorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    titulo: { type: String, required: true },
    texto: { type: String, required: true },
    tipo: { type: String, enum: ['noticia'], required: true },
    imagenes: { type: [String], default: [], maxLength: 3 },
    fecha: { type: Date, default: Date.now },
    instalacionId: { type: Schema.Types.ObjectId, ref: 'Instalacion' },
    comunaId: { type: Schema.Types.ObjectId, ref: 'Comuna' },
    regionId: { type: Schema.Types.ObjectId, ref: 'Region' },
    contentJson: { type: Schema.Types.Mixed, required: true }, // Nuevo campo flexible
});

export const NoticiaModel = mongoose.model<NoticiaDocument>('Noticia', NoticiaSchema);