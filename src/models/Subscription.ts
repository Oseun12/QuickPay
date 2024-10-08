import mongoose, { Schema, Document } from "mongoose";

// Define the Subscription Document interface
export interface ISubscription extends Document {
    userId: Schema.Types.ObjectId;
    plan: string;
    amount: number;
    status: 'Active' | 'Inactive' | 'Expired';
    startDate: Date;
    endDate: Date;
    paymentStatus: 'Paid' | 'Pending' | 'Failed';
    transactionId?: string;
}

// Define the Subscription Schema interface
const SubscriptionSchema: Schema = new Schema ({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Expired'],
        default: 'Active'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Pending', 'Failed'],
        default: 'Pending'
    },
    transactionId: {
        type: String
    }
})

//Create and export Subscription model
export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema)