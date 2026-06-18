import { Router } from 'express';
import { requireAuth, requireRole } from '../../middlewares/auth.middleware.js';
import { imageUpload, postImage } from './controller.js';

export const uploadsRouter = Router();

// Upload anh len S3. Chi admin moi duoc upload (quan ly noi dung).
uploadsRouter.post('/image', requireAuth, requireRole('admin'), imageUpload.single('image'), postImage);
