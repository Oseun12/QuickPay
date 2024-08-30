import axios from "axios";
import { Request, Response } from "express";
import { Transaction } from "../models/Transaction";
import { IUser } from "../models/User";

declare global {
    namespace Express {
        interface User extends IUser {}
    }
}

export async function buyAirtime(req: Request, res: Response) {
    console.log('User in request:', req.user);
    const user = req.user as IUser;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized user' });
    }

    const { amount, phoneNumber, network } = req.body;

    try {
        const response = await axios.post('/{{url}}/utility/purchase/airtime', {
            network, amount, phoneNumber
        }, {
            headers: {
                Authorization: `Bearer ${process.env.API_KEY}`
            }
        });

        if (response.data.status === 'success') {
            //Deduct the amount from the user's wallet
            if (user.balance < amount) {
                return res.status(400).json({ message: 'Insufficient balance' });
            }

            user.balance -= amount;
            await user.save();

            const newTransaction = new Transaction({
                userId: user._id,
                amount, 
                transactionType: 'Airtime',
                network,
                phoneNumber,
                transactionNumber: response.data.transactionId,
                status: 'Successful',
                transactionDate: new Date(),
            });

            await newTransaction.save();
            res.status(200).json({ message: 'Airtime purchased successfully', transaction: newTransaction });
        } else {
            res.status(400).json({ message: 'Failed to purchase airtime', error: response.data.message });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error purchasing airtime', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export async function payElectricityBill(req: Request, res: Response) {
    const user = req.user as IUser;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized user' });
    }

    const { amount, meterNumber, provider } = req.body;

    try{
        const response = await axios.post('/', {
            provider, amount, meterNumber
        }, {
            headers: {
                Authorization: `Bearer ${process.env.API_KEY}`,
            }
        });
        if (response.data.status === 'success') {
            if (user.balance < amount) {
                return res.status(400).json({ message: 'Insufficient balance' });
            }

            user.balance -= amount;
            await user.save();

            const newTransaction = new Transaction({
                userId: user._id,
                amount,
                transactionType: 'Electricity Bill',
                provider,
                meterNumber,
                transactionNumber: response.data.transactionId,
                status: 'Successful',
                transactionDate: new Date(),
            });
            await newTransaction.save();
            res.status(200).json({ message: 'Electricity bill paid successfully', transaction: newTransaction });
        } else {
            res.status(400).json({ message: 'Failed to pay electricity bill', error: response.data.message });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error purchasing airtime', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export async function buyData(req: Request, res: Response) {
    console.log('User in request:', req.user);
    const user = req.user as IUser;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized user' });
    }

    const { amount, phoneNumber, network } = req.body;

    try {
        const response = await axios.post('/{{url}}/utility/purchase/data', {
            network, amount, phoneNumber
        }, {
            headers: {
                Authorization: `Bearer ${process.env.API_KEY}`
            }
        });

        if (response.data.status === 'success') {
            //Deduct the amount from the user's wallet
            if (user.balance < amount) {
                return res.status(400).json({ message: 'Insufficient balance' });
            }

            user.balance -= amount;
            await user.save();

            const newTransaction = new Transaction({
                userId: user._id,
                amount, 
                transactionType: 'Airtime',
                network,
                phoneNumber,
                transactionNumber: response.data.transactionId,
                status: 'Successful',
                transactionDate: new Date(),
            });

            await newTransaction.save();
            res.status(200).json({ message: 'data purchased successfully', transaction: newTransaction });
        } else {
            res.status(400).json({ message: 'Failed to purchase data', error: response.data.message });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error purchasing data', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}
