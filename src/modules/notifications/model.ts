import { Schema, model, type Types } from 'mongoose';

export const devicePlatforms = ['android', 'ios', 'web'] as const;
export type DevicePlatform = (typeof devicePlatforms)[number];

// Token thiet bi de gui push qua FCM
export interface IDeviceToken {
  user_id: Types.ObjectId;
  token: string;
  platform: DevicePlatform;
  created_at?: Date;
}

const deviceTokenSchema = new Schema<IDeviceToken>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    platform: { type: String, enum: devicePlatforms, default: 'android' },
    created_at: { type: Date, default: () => new Date() },
  },
  { versionKey: false }
);

export const DeviceTokenModel = model<IDeviceToken>('DeviceToken', deviceTokenSchema, 'device_tokens');

// Cau hinh nhac hoc dinh ky cua tung user
export interface IReminderSetting {
  user_id: Types.ObjectId;
  enabled: boolean;
  time: string; // 'HH:mm' theo gio UTC
  days: number[]; // 0=CN ... 6=Thu7. Rong = moi ngay
  updated_at?: Date;
}

const reminderSettingSchema = new Schema<IReminderSetting>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    enabled: { type: Boolean, default: true },
    time: { type: String, default: '19:00' },
    days: { type: [Number], default: [] },
    updated_at: { type: Date, default: () => new Date() },
  },
  { versionKey: false }
);

export const ReminderSettingModel = model<IReminderSetting>(
  'ReminderSetting',
  reminderSettingSchema,
  'reminder_settings'
);

// Nhat ky thong bao da gui
export interface INotificationLog {
  user_id: Types.ObjectId;
  title: string;
  body: string;
  provider: string;
  success: boolean;
  created_at?: Date;
}

const notificationLogSchema = new Schema<INotificationLog>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    provider: { type: String, default: 'log' },
    success: { type: Boolean, default: false },
    created_at: { type: Date, default: () => new Date() },
  },
  { versionKey: false }
);

export const NotificationLogModel = model<INotificationLog>(
  'NotificationLog',
  notificationLogSchema,
  'notification_logs'
);
