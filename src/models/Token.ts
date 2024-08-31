import mongoose, { Schema, Document } from 'mongoose';

// Define the Token document interface
export interface IToken extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}

// Define the Token Schema interface
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

//Export Token model
export default mongoose.model<IToken>('Token', TokenSchema);
