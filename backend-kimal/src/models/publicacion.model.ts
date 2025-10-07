import mongoose, {Schema, Document, Types} from 'mongoose';
import { ComunaModel } from './comuna.model';
import { RegionModel } from './region.model';

export interface PublicacionDocument extends Document {
    publicadorId: Types.ObjectId;
    tipo: 'pregunta' | 'reporte';
    texto: string;
    imagenes: string[]; //URLS DE IMAGENES
    fecha: Date;
    instalacionId?: Types.ObjectId;
    comunaId?: Types.ObjectId | typeof ComunaModel;
    regionId?: Types.ObjectId | typeof RegionModel;
}

const PublicacionSchema = new Schema<PublicacionDocument>({
    publicadorId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    tipo: { type: String, enum: ['pregunta', 'reporte', 'noticia'], required: true },
    texto: { type: String, required: true },
    imagenes: { type: [String], default: [], maxlength: 3 },
    fecha: { type: Date, default: Date.now },
    instalacionId: { type: Schema.Types.ObjectId, ref: 'Instalacion' },
    comunaId: { type: Schema.Types.ObjectId, ref: 'Comuna' },
    regionId: { type: Schema.Types.ObjectId, ref: 'Region' },
});

export const PublicacionModel = mongoose.model<PublicacionDocument>('Publicacion', PublicacionSchema);