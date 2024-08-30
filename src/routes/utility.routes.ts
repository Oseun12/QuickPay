import express from 'express';
import { Router } from 'express';
import { payElectricityBill, buyAirtime, buyData } from '../controllers/utilityController';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();

router.post('/buy-airtime', authenticateToken, buyAirtime);
router.post('/buy-data', authenticateToken, buyData)
router.post('/electricity', payElectricityBill);

export default router;

