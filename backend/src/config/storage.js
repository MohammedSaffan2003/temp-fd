import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
const contentDir = path.join(uploadsDir, 'content');
const thumbnailsDir = path.join(uploadsDir, 'thumbnails');

[uploadsDir, contentDir, thumbnailsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export const storage = {
  getContentPath: (filename) => path.join(contentDir, filename),
  getThumbnailPath: (filename) => path.join(thumbnailsDir, filename),
  getContentUrl: (filename) => `/uploads/content/${filename}`,
  getThumbnailUrl: (filename) => `/uploads/thumbnails/${filename}`,
};