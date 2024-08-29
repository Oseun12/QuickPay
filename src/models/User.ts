import mongoose, { Schema, Document } from 'mongoose';
import { IToken } from '../models/Token';

export interface IUser extends Document {
    email: string;
    password: string;
    _id: Schema.Types.ObjectId;
    googleId?: string;
    token?: IToken['_id'];
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    googleId: {
        type: String
    },
    token: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Token'
    }
});

export default mongoose.model<IUser>('User', UserSchema);
