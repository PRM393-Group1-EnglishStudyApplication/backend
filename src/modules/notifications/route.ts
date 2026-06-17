import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  deviceTokenSchema,
  getReminders,
  listNotifications,
  registerToken,
  reminderSettingSchema,
  sendTestNotification,
  testNotificationSchema,
  unregisterToken,
  updateReminders,
} from './controller.js';

export const notificationsRouter = Router();

notificationsRouter.post('/device-tokens', requireAuth, validate(deviceTokenSchema), registerToken);
notificationsRouter.delete('/device-tokens', requireAuth, validate(deviceTokenSchema), unregisterToken);
notificationsRouter.get('/reminders/me', requireAuth, getReminders);
notificationsRouter.put('/reminders/me', requireAuth, validate(reminderSettingSchema), updateReminders);
notificationsRouter.get('/me', requireAuth, listNotifications);
notificationsRouter.post('/test', requireAuth, validate(testNotificationSchema), sendTestNotification);
