import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import { devicePlatforms } from './model.js';
import { isValidTimeString } from './reminder.js';
import {
  getReminderSetting,
  listMyNotifications,
  registerDeviceToken,
  removeDeviceToken,
  sendNotificationToUser,
  updateReminderSetting,
} from './service.js';

export const deviceTokenSchema = z.object({
  token: z.string().min(1, 'token khong duoc de trong'),
  platform: z.enum(devicePlatforms).optional(),
});

export const reminderSettingSchema = z.object({
  enabled: z.boolean().optional(),
  time: z.string().refine(isValidTimeString, 'time phai dang HH:mm (24h)').optional(),
  days: z.array(z.number().int().min(0).max(6)).max(7).optional(),
});

export const testNotificationSchema = z.object({
  title: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
});

export const registerToken = asyncHandler(async (req, res) => {
  const { token, platform } = req.body as z.infer<typeof deviceTokenSchema>;
  const device = await registerDeviceToken(req.user!._id.toString(), token, platform ?? 'android');
  return sendSuccess(res, device, 'Device token registered', 201);
});

export const unregisterToken = asyncHandler(async (req, res) => {
  const { token } = req.body as z.infer<typeof deviceTokenSchema>;
  return sendSuccess(res, await removeDeviceToken(req.user!._id.toString(), token), 'Device token removed');
});

export const getReminders = asyncHandler(async (req, res) => {
  return sendSuccess(res, await getReminderSetting(req.user!._id.toString()));
});

export const updateReminders = asyncHandler(async (req, res) => {
  const payload = req.body as z.infer<typeof reminderSettingSchema>;
  return sendSuccess(res, await updateReminderSetting(req.user!._id.toString(), payload), 'Reminder updated');
});

export const listNotifications = asyncHandler(async (req, res) => {
  return sendSuccess(res, await listMyNotifications(req.user!._id.toString()));
});

export const sendTestNotification = asyncHandler(async (req, res) => {
  const { title, body } = req.body as z.infer<typeof testNotificationSchema>;
  const result = await sendNotificationToUser(
    req.user!._id.toString(),
    title ?? 'Thong bao thu nghiem',
    body ?? 'Day la thong bao test tu backend.'
  );
  return sendSuccess(res, result, 'Test notification dispatched');
});
