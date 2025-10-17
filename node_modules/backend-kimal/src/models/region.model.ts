import mongoose, { Schema, Document } from 'mongoose';

export interface IRegion extends Document {
  nombre: string;
}

const RegionSchema: Schema = new Schema({
  nombre: { type: String, required: true }
}, { collection: 'regiones' });

export const RegionModel = mongoose.model<IRegion>('Region', RegionSchema);
