import express from 'express';
import {
  addRating,
  getContentRatings,
  getUserRating
} from '../controllers/rating.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validateRating, validateContentId } from '../middleware/validate.middleware.js';

const router = express.Router();

router.post('/', [verifyToken, validateRating, validateContentId], addRating);
router.get('/content/:contentId', [verifyToken, validateContentId], getContentRatings);
router.get('/user/:contentId', [verifyToken, validateContentId], getUserRating);

export default router;