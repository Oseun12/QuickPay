"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignup = getSignup;
exports.postSignup = postSignup;
exports.postLogin = postLogin;
exports.postForgotPassword = postForgotPassword;
exports.logout = logout;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const Token_1 = __importDefault(require("../models/Token"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
async function getSignup(req, res) {
    res.send('Registered!!');
}
;
async function postSignup(req, res) {
    const { email, password } = req.body;
    try {
        //To confirm if the user already has an account
        const existingUser = await User_1.default.findOne({ email });
        //If user exists a new account with that credentials should not be created
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        //Hash the password of the user
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        //Create a new user if user doesnt exists
        const newUser = new User_1.default({ email, password: hashedPassword });
        //Save the user profile
        await newUser.save();
        //Generate token for the account
        const token = jsonwebtoken_1.default.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to Signup' });
    }
}
;
async function postLogin(req, res) {
    const { email, password } = req.body;
    try {
        //To confirm the existence of the user
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        //Password verification
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Password' });
        }
        //Generate Token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to Log in' });
    }
}
async function postForgotPassword(req, res) {
    const { email } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(20).toString('hex');
        // token.resetPasswordToken = token;
        // Create a new Token document
        const token = new Token_1.default({
            userId: user._id,
            resetPasswordToken: resetToken,
            resetPasswordExpires: new Date(Date.now() + 3600000) // 1 hour
        });
        await token.save();
        //Send reset token to the user email
        const transporter = nodemailer_1.default.createTransport({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Request cannot be processed' });
    }
}
;
async function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
        else {
            res.json({ message: 'Logout successfully!' });
        }
    });
}
;
