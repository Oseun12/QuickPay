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

// This should be displayed on the UI
// const companyBankDetails = {
//     accountName: "Company Name",
//     accountNumber: "1234567890",
//     bankName: "YourBank",
// };

export async function bankTransferWebhook(req: Request, res: Response) {
    const { senderName, amount, transactionReference } = req.body;

    try {
        // Assuming senderName can be used to identify the user
        const user = await User.findOne({ email: senderName });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new transaction record
        const newTransaction = new Transaction({
            userId: user._id,
            amount: amount,
            totalAmount: amount,
            status: 'Successful',
            paymentMethod: 'Bank Transfer',
            transactionNumber: transactionReference,
            transactionDate: new Date(),
        });

        await newTransaction.save();

        // Credit the user's wallet
        user.balance += amount;
        await user.save();

        res.status(200).json({ message: 'Wallet funded successfully', balance: user.balance, transaction: newTransaction });
    } catch (error) {
        res.status(500).json({ message: 'Error processing bank transfer', error });
    }
}