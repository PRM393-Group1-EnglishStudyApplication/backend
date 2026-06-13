import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

export interface PushMessage {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface PushResult {
  provider: 'fcm' | 'log';
  success: boolean;
  detail?: unknown;
}

// Gui push notification. Neu khong cau hinh FCM_SERVER_KEY -> che do "log" (khong can credential).
export async function sendPush(message: PushMessage): Promise<PushResult> {
  if (!env.fcm.serverKey) {
    logger.info(`[notifications:log] -> ${message.token}: ${message.title} - ${message.body}`);
    return { provider: 'log', success: true };
  }

  try {
    const response = await fetch(env.fcm.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `key=${env.fcm.serverKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: message.token,
        notification: { title: message.title, body: message.body },
        data: message.data ?? {},
      }),
    });

    const detail = await response.json().catch(() => null);
    return { provider: 'fcm', success: response.ok, detail };
  } catch (error) {
    logger.error(`[notifications:fcm] gui that bai: ${(error as Error).message}`);
    return { provider: 'fcm', success: false, detail: (error as Error).message };
  }
}
