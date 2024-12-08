import express from 'express';
import multer from 'multer';
import { 
  getUserProfile,
  updateWatchlist,
  updateWatchHistory,
  updateProfileImage
} from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Configure multer with file size and type validation
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
  }
});

router.get('/profile', verifyToken, getUserProfile);
router.post('/watchlist', verifyToken, updateWatchlist);
router.post('/history', verifyToken, updateWatchHistory);
router.post('/profile-image', 
  verifyToken, 
  upload.single('image'),
  (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size exceeds 5MB limit'
        });
      }
    }
    next(error);
  },
  updateProfileImage
);

export default router;