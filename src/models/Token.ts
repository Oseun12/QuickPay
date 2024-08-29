import mongoose, { Schema, Document } from 'mongoose';

export interface IToken extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}

const TokenSchema: Schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    resetPasswordToken: {
        type: String
    },

    resetPasswordExpires: {
        type: Date
    },
});

export default mongoose.model<IToken>('Token', TokenSchema);
