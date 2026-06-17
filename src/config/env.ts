import dotenv from 'dotenv';

dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  isProd: process.env.NODE_ENV === 'production',

  databaseUrl: required('DATABASE_URL'),
  clerk: {
    publishableKey: required('CLERK_PUBLISHABLE_KEY'),
    secretKey: required('CLERK_SECRET_KEY'),
    webhookSigningSecret: required('CLERK_WEBHOOK_SIGNING_SECRET'),
  },

  corsOrigin: process.env.CORS_ORIGIN || '*',

  // 6.0 - TTS proxy. Mac dinh dung Google Translate TTS (khong can API key).
  tts: {
    baseUrl: process.env.TTS_BASE_URL || 'https://translate.google.com/translate_tts',
    defaultLang: process.env.TTS_DEFAULT_LANG || 'en',
    maxLength: Number(process.env.TTS_MAX_LENGTH) || 200,
  },

  // 6.1 - Push notification qua FCM. Neu khong cau hinh serverKey -> chay che do "log".
  fcm: {
    serverKey: process.env.FCM_SERVER_KEY || '',
    endpoint: process.env.FCM_ENDPOINT || 'https://fcm.googleapis.com/fcm/send',
  },
  notifications: {
    schedulerEnabled: process.env.NOTIFICATIONS_SCHEDULER_ENABLED === 'true',
    defaultTitle: process.env.REMINDER_TITLE || 'Da den gio hoc roi!',
    defaultBody: process.env.REMINDER_BODY || 'Danh vai phut on tap de giu chuoi streak nhe.',
  },
} as const;
