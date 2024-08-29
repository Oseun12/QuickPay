import express, { Router } from 'express';
import passport from 'passport';
import { postSignup, postLogin, postForgotPassword, logout, getSignup, getLogin } from '../controllers/authController';



const router: Router = express.Router();

router.post('/signup', postSignup);

router.get('/signup', getSignup)

router.post('/login', postLogin);

router.get('/login', getLogin)


router.post('/forgot-password', postForgotPassword);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        //To redirect to the next page after successful login
        res.redirect('/dashboard');
    }
)
router.post('/logout', logout);

export default router;