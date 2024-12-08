import multer from 'multer';
import path from 'path';
import { storage } from '../config/storage.js';
import { createError } from '../utils/error.util.js';

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'thumbnail') {
      cb(null, path.dirname(storage.getThumbnailPath('')));
    } else {
      cb(null, path.dirname(storage.getContentPath('')));
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'video') {
    if (!file.mimetype.startsWith('video/')) {
      cb(createError(400, 'Only video files are allowed'));
      return;
    }
    // 100MB limit for videos
    if (parseInt(req.headers['content-length']) > 100 * 1024 * 1024) {
      cb(createError(400, 'Video size must be less than 100MB'));
      return;
    }
  } else if (file.fieldname === 'thumbnail') {
    if (!file.mimetype.startsWith('image/')) {
      cb(createError(400, 'Only image files are allowed for thumbnails'));
      return;
    }
    // 5MB limit for thumbnails
    if (parseInt(req.headers['content-length']) > 5 * 1024 * 1024) {
      cb(createError(400, 'Thumbnail size must be less than 5MB'));
      return;
    }
  }
  cb(null, true);
};

export const uploadContent = multer({
  storage: videoStorage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
}).fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);