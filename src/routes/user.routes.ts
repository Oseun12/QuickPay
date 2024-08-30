import express from 'express';
import { Router } from 'express';
import { createUserProfile, updateUserProfile, deleteUserProfile, getAllUserProfiles, getUserByEmail } from '../controllers/userController';

const router: Router = express.Router();

router.post('/users', createUserProfile);
router.put('/users/:id', updateUserProfile);
router.delete('/users/:id', deleteUserProfile);
router.get('/user/:email', getUserByEmail);
router.get('/users', getAllUserProfiles);

export default router;