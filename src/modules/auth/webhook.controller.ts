import { verifyWebhook } from '@clerk/express/webhooks';
import { env } from '../../config/env.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import {
  deleteClerkUser,
  mapClerkWebhookUser,
  syncClerkUser,
  type ClerkWebhookUserLike,
} from './auth.service.js';

type ClerkWebhookEvent = {
  type: string;
  data: unknown;
};

export const handleClerkWebhook = asyncHandler(async (req, res) => {
  const event = (await verifyWebhook(req, {
    signingSecret: env.clerk.webhookSigningSecret,
  })) as ClerkWebhookEvent;

  if (event.type === 'user.created' || event.type === 'user.updated') {
    await syncClerkUser(mapClerkWebhookUser(event.data as ClerkWebhookUserLike));
  }

  if (event.type === 'user.deleted') {
    const deletedUser = event.data as { id?: string };
    if (deletedUser.id) {
      await deleteClerkUser(deletedUser.id);
    }
  }

  return sendSuccess(res, { received: true }, 'Webhook received');
});
