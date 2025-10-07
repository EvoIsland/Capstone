import mongoose, {Schema, Document, Types} from 'mongoose';

export interface PasswordResetTokenDocument extends Document {
    userId: Types.ObjectId;
    token: string;
    expires: Date;
}

const PasswordResetTokenSchema = new Schema<PasswordResetTokenDocument>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    token: { type: String, required: true, unique:true },
    expires: { type: Date, required: true }
});

export const PasswordResetTokenModel = mongoose.model<PasswordResetTokenDocument>(
    'PasswordResetToken',
    PasswordResetTokenSchema
);