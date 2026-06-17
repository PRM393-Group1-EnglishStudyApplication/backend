import http from 'node:http';
import { app } from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/database.js';
import { logger } from './config/logger.js';
import { startReminderScheduler, stopReminderScheduler } from './modules/notifications/service.js';

let server: http.Server | null = null;

async function bootstrap(): Promise<void> {
  try {
    await connectDB();
    logger.info('Database connected');

    server = app.listen(env.port, () => {
      logger.info(`Server is running at http://localhost:${env.port}`);
      logger.info(`API docs available at http://localhost:${env.port}/api-docs`);
    });

    startReminderScheduler();
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  logger.info(`${signal} received, shutting down`);
  stopReminderScheduler();

  if (server) {
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    return;
  }

  await disconnectDB();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

void bootstrap();
