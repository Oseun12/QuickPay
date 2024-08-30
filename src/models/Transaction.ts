import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
    userId: string;
    network: string;
    airtimeCode: string;
    amount: number;
    status: 'Pending' | 'Successful' | 'Failed';
    transactionDate: Date;
    phoneNumber: number;
}

const TransactionSchema: Schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    network: {
        type: String,
        required: true
    },
    airtimeCode: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: 
            ['Pending', 'Successfull', 'Failed'],
        default: 'Pending'
    },
    transactionDate: {
        type: Date,
        default: Date.now()
    },
    phoneNumber: {
        type: Number,
        required: true
    }
})

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);