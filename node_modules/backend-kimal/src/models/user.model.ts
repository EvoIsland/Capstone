import mongoose from 'mongoose';

// Definir la interfaz para el documento de usuario
export interface IUser {
  _id: mongoose.Types.ObjectId;
  nombre: string;
  apellido: string;
  correo: string;
  contraseña: string;
  rol: 'usuario' | 'admin'
  recibirCartas: boolean;
  puebloOriginario: boolean;
  nombrePueblo?: string;
  direccion?: string;
  verificado: boolean;
  tokenVerificacion?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Definir el esquema
const userSchema = new mongoose.Schema<IUser>({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  rol: { type: String,
         enum: ['usuario', 'admin'],
         default: 'usuario'
  },
  recibirCartas: { type: Boolean, default: false },
  puebloOriginario: { type: Boolean, default: false },
  nombrePueblo: { type: String },
  direccion: { type: String },
  verificado: { type: Boolean, default: false },
  tokenVerificacion: { type: String }
}, {
  timestamps: true
});

// Exportar el modelo tipado
export const UserModel = mongoose.model<IUser>('User', userSchema);
