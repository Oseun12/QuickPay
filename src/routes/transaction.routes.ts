import express from 'express';
import { Router } from 'express';
import { convertAirtimeToCash, getAllTransactions } from '../controllers/transactionController';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();

router.post('/convert-airtime', convertAirtimeToCash);
router.get('/transactions', getAllTransactions);

export default router;