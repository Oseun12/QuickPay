"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post('/signup', authController_1.postSignup);
router.post('/login', authController_1.postLogin);
router.post('/forgot-password', authController_1.postForgotPassword);
router.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    //To redirect to the next page after successful login
    res.redirect('/dashboard');
});
router.post('/logout', authController_1.logout);
exports.default = router;
