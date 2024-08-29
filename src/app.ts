import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import authRoutes from './routes/auth.routes';
import './config/passport';
import bodyParser = require('body-parser');

dotenv.config();

const app = express();


app.use(express.json());
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To connect to the database
mongoose.connect(process.env.MONGO_URI!)
.then(() => console.log('Connected to Database'))
.catch(err => console.log(err));


app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));