import { Request, Response } from 'express';
import { Subscription } from '../models/Subscription';
import { User } from '../models/User';
import { processPayment } from '../service/paymentService'; 

export const purchaseSubscription = async (req: Request, res: Response) => {
    const { userId, plan, amount, endDate, paymentDetails } = req.body;

    try {
        // Validate user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Process payment
        const paymentResult = await processPayment(amount, paymentDetails); 
        if (paymentResult.status === 'failed') {
            return res.status(400).json({ message: 'Payment failed', error: paymentResult.error });
        }

        // Create subscription
        const subscription = new Subscription({
            userId,
            plan,
            amount,
            endDate,
            paymentStatus: 'Paid',
            transactionId: paymentResult.transactionId
        });

        await subscription.save();
        res.status(201).json({ message: 'Subscription purchased successfully', subscription });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error purchasing data', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
