import mongoose, { Schema, Document } from 'mongoose';
import { ComunaModel } from './comuna.model';
import { RegionModel } from './region.model';

export interface IInstalacion extends Document {
  nombre: string;
  direccion: string;
  comunaId: mongoose.Types.ObjectId | typeof ComunaModel;
  regionId: mongoose.Types.ObjectId | typeof RegionModel;
  location: {
    type: 'Point'
    coordinates: [number, number]
  }
  // tipo: string;
  // descripcion?: string;
  // imagenes?: string[];
}

const InstalacionSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  comunaId: { type: Schema.Types.ObjectId, ref: 'Comuna', required: true },
  regionId: { type: Schema.Types.ObjectId, ref: 'Region', required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
  // tipo: { type: String, required: true },
  // descripcion: { type: String },
  // imagenes: [{ type: String }],
}, { timestamps: true, collection: 'instalaciones' });

InstalacionSchema.index({ location: '2dsphere' }) // Índice geoespacial

export const InstalacionModel = mongoose.model<IInstalacion>('Instalacion', InstalacionSchema);
