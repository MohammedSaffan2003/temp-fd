import express from 'express';
import { 
  getAllContent, 
  getFeaturedContent, 
  getContentById,
  searchContent,
  uploadContent,
  deleteContent
} from '../controllers/content.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { uploadContent as uploadMiddleware } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllContent);
router.get('/featured', verifyToken, getFeaturedContent);
router.get('/search', verifyToken, searchContent);
router.get('/:id', verifyToken, getContentById);
router.post('/upload', verifyToken, uploadMiddleware, uploadContent);
router.delete('/:id', verifyToken, deleteContent);

export default router;