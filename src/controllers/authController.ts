import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt  from "jsonwebtoken";
import { User, IUser } from '../models/User'
import Token, { IToken } from '../models/Token';
import { addReferralBonus } from './referralController'
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


export async function getSignup(req: Request, res: Response) {
    res.send('Registered!!');
};

export async function postSignup (req: Request, res: Response ) {
    const { email, password, referralCode } = req.body;

    try {
        console.log('Request Body:', req.body);
        //To confirm if the user already has an account
        const existingUser = await User.findOne({ email });
        console.log('Existing User:', existingUser);

        //If user exists a new account with that credentials should not be created
        if(existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        //Hash the password of the user
        const hashedPassword = await bcrypt.hash(password, 10);
       // To generate unique referral code
        const userReferralCode = uuidv4();

        //Create a new user if user doesnt exists
        const newUser: IUser = new User({ email, password: hashedPassword, referralCode: userReferralCode, referredBy: referralCode });
        console.log('New User:', newUser);

        //Save the user profile
        await newUser.save();

        if(referralCode) {
            await addReferralBonus(referralCode)
        }

        //Generate token for the account
        // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
       return  res.status(201).json({ newUser });
    } catch(error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Unable to Signup', error })
    }
};



export async function getLogin(req: Request, res: Response) {
    res.send('Login!!');
};

export async function postLogin (req: Request, res: Response) {
    const { email, password } = req.body;

    try{
        //To confirm the existence of the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        //Password verification
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: 'Invalid Password' });
        }

        //Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
       return  res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Unable to Log in' })
    }
}

export async function postForgotPassword (req: Request, res: Response) {
    const { email } = req.body;

    try{ 
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        // token.resetPasswordToken = token;

        // Create a new Token document
        const token = new Token({
            userId: user._id,
            resetPasswordToken: resetToken,
            resetPasswordExpires: new Date(Date.now() + 3600000) // 1 hour
        });

        await token.save();

        //Send reset token to the user email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Your New Password',
            text: `You are receiving this because you have requested that your password should be reset for your account.
            Please click on the link below to reset the password http://localhost:3000/${token}`
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                return res.status(500).json({ message: "Error sending email" });
            }
            res.status(200).json({ message: 'Email sent' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Request cannot be processed' })
    }
};

export async function logout (req: Request, res: Response){
    req.session.destroy((err: Error | null) => {
        if (err) {
            console.error('Error logging out:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.json({ message: 'Logout successfully!' });
        }
    });
};

