// routes/subscriptionRoutes.ts
import { Router } from 'express';
import { purchaseSubscription } from '../controllers/subscriptionController';
import { authenticateToken } from '../middleware/auth'; 

const router = Router();


router.post('/purchase', authenticateToken, purchaseSubscription);

export default router;
