import mongoose, { Schema, Document } from 'mongoose';
import { IToken } from '../models/Token';

// Define the User document interface
export interface IUser extends Document {
    email: string;
    password: string;
    balance: number;
    referralCode?: string;
    referredBy?: string;
    bankAccount?: {
        bankName: string;
        accountNumber: string;
        accountHolderName: string;
        currency: 'USD' | 'EUR' | 'NGN';
    };
    googleId?: string;
    token?: IToken['_id'];
}

// Define the User schema
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
            type: String,
            required: false
        },
        accountNumber: {
            type: String,
            required: false
        },
        accountHolderName: {
            type: String,
            required: false
        },
        currency: {
            type: String,
            enum: ['USD', 'EUR', 'NGN'],
            required: false
        },
    },
    googleId: {
        type: String,
        required: false
    },
    token: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Token',
        required: false
    }
});

// Create and export the User model
export const User = mongoose.model<IUser>('User', UserSchema);
