import mongoose, { Schema, Document } from 'mongoose';

// Define the Transaction document interface
export interface ITransaction extends Document {
    userId: string;
    network?: string;
    airtimeCode: string;
    amount: number;
    totalAmount: number;
    transactionType: 'Airtime' | 'Data' | 'Electricity' | 'Wallet' | 'Bank' | 'Transfer';
    status: 'Pending' | 'Successful' | 'Failed';
    paymentMethod: 'Bank' | 'Wallet' | 'Transfer';
    transactionDate: Date;
    transactionNumber: string;
    phoneNumber?: number;
    meterNumber?: string;
    provider?: string; 
}

// Define the Transaction Schema interface
const TransactionSchema: Schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    network: {
        type: String,
        required: function (this: ITransaction) { return this.transactionType === 'Airtime' || this.transactionType === 'Data'; }
    },
    airtimeCode: {
        type: String,
        required: false
    },
    amount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: 
            ['Pending', 'Successful', 'Failed'],
        default: 'Pending',
        required: true,
    },
    transactionType: {
        type: String,
        enum: ['Airtime', 'Data', 'Electricity', 'Wallet', 'Bank', 'Transfer'],        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['Bank', 'Transfer', 'Wallet'],
        required: true
    },
    transactionDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    transactionNumber: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: function (this: ITransaction) { return this.transactionType === 'Airtime' || this.transactionType === 'Data'; }
    },
    meterNumber: {
        type: String,
        required: function (this: ITransaction) { return this.transactionType === 'Electricity'; }
    },
    provider: {
        type: String,
        required: function (this: ITransaction) { return this.transactionType === 'Electricity'; }
    }
})

// Create and export the Transaction model
export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);