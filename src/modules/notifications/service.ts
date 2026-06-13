import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { toObjectId } from '../../utils/mongo.js';
import {
  DeviceTokenModel,
  NotificationLogModel,
  ReminderSettingModel,
  type DevicePlatform,
  type IReminderSetting,
} from './model.js';
import { isReminderDue } from './reminder.js';
import { sendPush } from './provider.js';

// Dang ky token thiet bi (upsert theo token)
export function registerDeviceToken(userId: string, token: string, platform: DevicePlatform) {
  return DeviceTokenModel.findOneAndUpdate(
    { token },
    { user_id: toObjectId(userId, 'userId'), token, platform },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

export async function removeDeviceToken(userId: string, token: string) {
  await DeviceTokenModel.deleteOne({ user_id: toObjectId(userId, 'userId'), token });
  return { token, removed: true };
}

// Lay (hoac tao mac dinh) cau hinh nhac hoc
export function getReminderSetting(userId: string) {
  return ReminderSettingModel.findOneAndUpdate(
    { user_id: toObjectId(userId, 'userId') },
    { $setOnInsert: { enabled: true, time: '19:00', days: [] } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

export function updateReminderSetting(userId: string, payload: Partial<IReminderSetting>) {
  return ReminderSettingModel.findOneAndUpdate(
    { user_id: toObjectId(userId, 'userId') },
    { ...payload, updated_at: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );
}

export function listMyNotifications(userId: string, limit = 50) {
  return NotificationLogModel.find({ user_id: toObjectId(userId, 'userId') })
    .sort({ created_at: -1 })
    .limit(limit)
    .lean();
}

// Gui thong bao toi tat ca thiet bi cua 1 user, co ghi log
export async function sendNotificationToUser(userId: string, title: string, body: string) {
  const userObjectId = toObjectId(userId, 'userId');
  const tokens = await DeviceTokenModel.find({ user_id: userObjectId }).lean();

  const results = [];
  for (const device of tokens) {
    const result = await sendPush({ token: device.token, title, body });
    await NotificationLogModel.create({
      user_id: userObjectId,
      title,
      body,
      provider: result.provider,
      success: result.success,
    });
    results.push({ token: device.token, ...result });
  }

  return { sent: results.length, results };
}

// Quet tat ca cau hinh dang bat, gui nhac cho user dung gio (chay dinh ky)
export async function dispatchDueReminders(now = new Date()) {
  const settings = await ReminderSettingModel.find({ enabled: true }).lean();
  let dispatched = 0;

  for (const setting of settings) {
    if (!isReminderDue(setting, now)) {
      continue;
    }
    await sendNotificationToUser(
      setting.user_id.toString(),
      env.notifications.defaultTitle,
      env.notifications.defaultBody
    );
    dispatched += 1;
  }

  if (dispatched > 0) {
    logger.info(`[notifications] da gui ${dispatched} nhac hoc.`);
  }
  return { dispatched };
}

let schedulerTimer: NodeJS.Timeout | null = null;

// Bo lap lich chay moi phut (chi bat khi NOTIFICATIONS_SCHEDULER_ENABLED=true)
export function startReminderScheduler(): void {
  if (!env.notifications.schedulerEnabled) {
    return;
  }
  if (schedulerTimer) {
    return;
  }
  schedulerTimer = setInterval(() => {
    dispatchDueReminders().catch((error) => logger.error(error));
  }, 60_000);
  logger.info('Reminder scheduler started (moi 60s)');
}

export function stopReminderScheduler(): void {
  if (schedulerTimer) {
    clearInterval(schedulerTimer);
    schedulerTimer = null;
  }
}
