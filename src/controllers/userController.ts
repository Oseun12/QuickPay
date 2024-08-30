import bcrypt from 'bcryptjs';
import { Request, Response } from "express";
import { User, IUser } from "../models/User";

export async function createUserProfile(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
        //To check for existing user Profile
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: IUser = new User({ email, password: hashedPassword, referralCode: req.body.referralCode });
        await newUser.save();

        return res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
}

export async function updateUserProfile(req: Request, res: Response) {
    const { id } = req.params;
    const { email } = req.body;

    try {
        const updatedUserProfile = await User.findByIdAndUpdate(id, { email }, { new: true });
        if(!updatedUserProfile) {
            return res.status(400).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUserProfile);
    } catch (error) {
        res.status(500).json({ message: "Unable to update User" });
    }
}

export async function deleteUserProfile(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const deleteUserProfile = await User.findByIdAndDelete(id);
        if(!deleteUserProfile) {
            return res.status(400).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting User' });
    }
}

export async function getUserByEmail(req: Request, res: Response) {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
}

export async function getAllUserProfiles(req: Request, res: Response) {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching all users" })
    }
}