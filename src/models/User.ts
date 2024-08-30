import mongoose, { Schema, Document } from 'mongoose';
import { IToken } from '../models/Token';

export interface IUser extends Document {
    email: string;
    password: string;
    balance: number;
    referralCode: string;
    referredBy?: string;
    bankAccount?: {
        bankName: string;
        accountNumber: string;
        accountHolderName: string;
        currency: 'USD' | 'EUR' | 'NGN';
    }
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
    balance: {
        type: Number,
        default: 0
    },
    referralCode: {
        type: String,
        unique: true,
        required: false
    },
    referredBy: {
        type: String,
        required: false
    },
    bankAccount: {
        bankName: {
            type: String
        },
        accountNumber: {
            type: String
        },
        accountHolderName: {
            type: String
        },
        currency: {
            type: String,
            enum: ['USD', 'EUR', 'NGN']
        },
    },
    googleId: {
        type: String
    },
    token: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Token'
    }
});

export const User = mongoose.model<IUser>('User', UserSchema);
