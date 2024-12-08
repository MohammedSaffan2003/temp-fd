import express from 'express';
import { giveReward, getCreatorStats } from '../controllers/reward.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/give', verifyToken, giveReward);
router.get('/stats', verifyToken, getCreatorStats);

export default router;