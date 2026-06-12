import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { clerkMiddleware } from '@clerk/express';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { swaggerSpec } from './config/swagger.js';
import { apiRouter } from './routes/index.js';
import { clerkWebhookRouter } from './modules/auth/webhook.route.js';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.js';
import { sendSuccess } from './utils/ApiResponse.js';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req, res) => {
  return res.json(swaggerSpec);
});
app.use('/api/webhooks/clerk', express.raw({ type: 'application/json' }), clerkWebhookRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  clerkMiddleware({
    publishableKey: env.clerk.publishableKey,
    secretKey: env.clerk.secretKey,
  })
);
app.use(
  morgan(env.isProd ? 'combined' : 'dev', {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

app.get('/', (_req, res) => {
  return sendSuccess(
    res,
    {
      name: 'elearning-backend',
      environment: env.nodeEnv,
      docs: '/api-docs',
      openapi: '/api-docs.json',
    },
    'Server is running'
  );
});

app.use('/api', apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
