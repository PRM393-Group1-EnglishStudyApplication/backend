import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB(): Promise<void> {
  await mongoose.connect(env.databaseUrl);
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
