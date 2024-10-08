import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import dashboardRoutes from './routes/dashboard.routes';
import transactionRoutes from './routes/transaction.routes';
import utilityRoutes from './routes/utility.routes';
import './config/passport';
import bodyParser = require('body-parser');
import session from 'express-session';


dotenv.config();

const app = express();

//Session set up
app.use(session({
    secret: process.env.SESSION_SECRET || 'secretsecret', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//To connect to the database
mongoose.connect(process.env.MONGO_URI!)
.then(() => console.log('Connected to Database'))
.catch(err => console.log(err));

//Router set up
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', transactionRoutes);
app.use('/api', utilityRoutes);

//Port set up
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));