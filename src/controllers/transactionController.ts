import { Request, Response } from "express";
import { Transaction, ITransaction } from "../models/Transaction";
import { User, IUser } from "../models/User";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

export async function convertAirtimeToCash(req: Request, res: Response) {
    const { userId, network, airtimeCode, amount, phoneNumber, paymentMethod } = req.body;

    try {
        const totalAmount = amount;
        const newTransaction: ITransaction = new Transaction({
            userId, network, airtimeCode, amount, totalAmount, phoneNumber, paymentMethod, transactionNumber: uuidv4(),
        });

        await newTransaction.save();

        //Connecting to the network provider
        const apiResponse = await axios.post('/', {
            network, airtimeCode, amount, phoneNumber 
        });

        if (apiResponse.data.success) {
            newTransaction.status = 'Successful'
            await newTransaction.save();

            //To credit the user's account
             const user = await User.findById(userId);
             if(user) {
                user.balance += apiResponse.data.convertedAmount;
                await user.save();
                return res.status(200).json({ message: 'Airtime converted successfully', balance: user.balance, transaction: newTransaction });
             } else {
                return res.status(200).json({ message: 'User not found'});
            }
        } else {
            newTransaction.status = 'Pending';
            await newTransaction.save();
            return res.status(400).json({ message: 'Failed to convert to cash' });
        }
    } catch (error) {
        console.error('Error converting airtime:', error);
        return res.status(500).json({ message: 'Error converting to cash' });
    }
}

export async function getAllTransactions(req: Request, res: Response) {
    try {
        const transactions = await Transaction.find().populate('userId', 'email');
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Unable to fetch transactions' })
    }
}

export async function fundWallet(req: Request, res: Response) {
    const user = req.user as IUser;
    const { amount, paymentSource } = req.body;

    if(!user) {
        return res.status(401).json({ message: 'Unautorized user' });
    }

    let paymentMethod: 'Wallet' | 'Bank' | 'Transfer';

    try {
        if (paymentSource === 'Transfer') {
            paymentMethod = 'Transfer';
        } else if (paymentSource === 'Wallet') {
            paymentMethod = 'Wallet';
        } else if(paymentSource === 'Bank') {
            paymentMethod = 'Bank'
        } else {
            return res.status(400).json({ message: 'Invalid payment Source' })
        }

        if (paymentMethod === 'Wallet' && user.balance < amount) {
            return res.status(400).json({ message: 'Insufficent balance' });
        }

        //Deduct the amount from the wallet balance
        if(paymentMethod == 'Wallet') {
            user.balance -= amount;
            await user.save();
        }

        //To set wew transaction receord
        const newTransaction = new Transaction({
            userId: user._id,
            amount: amount,
            totalAmount: amount,
            status: 'Successful',
            paymentMethod: paymentMethod,
            transactionNumber: uuidv4(),
            transactionDate: Date()
        });
        
        await newTransaction.save();

        res.status(200).json({ message: 'Wallet funded successfully', balance: user.balance, transaction: newTransaction});
    } catch (error) {
        res.status(500).json({ message: 'Error funding wallet' })
    }
}
