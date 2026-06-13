import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { speak, ttsQuerySchema } from './controller.js';

export const ttsRouter = Router();

// Public: Flutter co the goi de phat am tu/cau
ttsRouter.get('/', validate(ttsQuerySchema, 'query'), speak);
