import express from "express";
import { Router } from "express";
import {  getUserDashboard } from "../controllers/referralController";
// import { authenticateToken } from "../middleware/auth";

const router: Router = express.Router();

// router.post('/fund-wallet', authenticateToken, fundWallet);
router.get('/dashboard', getUserDashboard);

export default router;