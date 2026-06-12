import { Router } from 'express';
import { handleClerkWebhook } from './webhook.controller.js';

export const clerkWebhookRouter = Router();

clerkWebhookRouter.post('/', handleClerkWebhook);
