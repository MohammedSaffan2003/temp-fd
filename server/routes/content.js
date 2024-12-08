import express from 'express';
import { 
  getAllContent, 
  getFeaturedContent, 
  getContentById,
  searchContent
} from '../controllers/contentController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getAllContent);
router.get('/featured', verifyToken, getFeaturedContent);
router.get('/search', verifyToken, searchContent);
router.get('/:id', verifyToken, getContentById);

export default router;