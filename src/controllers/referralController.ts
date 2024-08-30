import { User } from "../models/User";
import { Request, Response } from "express";
import { IUser } from '../models/User';

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

export async function addReferralBonus(referralCode: string) {
    const referrer = await User.findOne({ referralCode });
    
    if(referrer) {
        referrer.balance += 100;
        await referrer.save();
    }
}



export async function fundWallet(req: Request, res: Response) {
    const user = req.user as IUser; 
    const { amount, bankAccountDetails } = req.body;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Simulate bank transaction
        const bankTransactionSuccess = simulateBankTransaction(bankAccountDetails, amount); 

        if (!bankTransactionSuccess) {
            return res.status(400).json({ message: 'Bank transaction failed' });
        }

        // Credit the user's wallet
        user.balance += amount;
        await user.save();

        res.status(200).json({ message: 'Wallet funded successfully', balance: user.balance });
    } catch (error) {
        res.status(500).json({ message: 'Unable to fund wallet' });
    }
}


export async function getUserDashboard(req: Request, res: Response) {
    const userId = (req.user as IUser).id

    try {
        const user = await User.findById(userId).select('-password'); 

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ 
            email: user.email, 
            balance: user.balance,
            referralCode: user.referralCode,
            referredBy: user.referredBy 
        });
    } catch (error) {
        res.status(500).json({ message: 'Unable to fetch user dashboard' });
    }
}


function simulateBankTransaction(bankAccountDetails: any, amount: number): boolean {
    // Logic to interact with the bank API or mock transaction
    console.log('Processing bank transaction:', bankAccountDetails, amount);
    return true; 
}