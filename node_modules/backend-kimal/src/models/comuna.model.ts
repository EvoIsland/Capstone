import mongoose, { Schema, Document } from 'mongoose';

export interface IComuna extends Document {
  nombre: string;
  regionId: mongoose.Types.ObjectId;
}

const ComunaSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  regionId: { type: Schema.Types.ObjectId, ref: 'Region', required: true }
}, { collection: 'comuna' });

export const ComunaModel = mongoose.model<IComuna>('Comuna', ComunaSchema);
