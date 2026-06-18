import multer from 'multer';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { uploadImageToS3 } from './service.js';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Luu file trong RAM roi day thang len S3 (khong ghi xuong dia).
export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(ApiError.badRequest('Chi chap nhan file anh (jpeg, png, webp, gif).'));
    }
    cb(null, true);
  },
});

export const postImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('Thieu file anh. Gui multipart/form-data voi field "image".');
  }
  const result = await uploadImageToS3(req.file);
  return sendSuccess(res, result, 'Uploaded', 201);
});
