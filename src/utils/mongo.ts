import { Types } from 'mongoose';
import { ApiError } from './ApiError.js';

export function toObjectId(id: string, field = 'id'): Types.ObjectId {
  if (!Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest(`${field} khong hop le.`);
  }
  return new Types.ObjectId(id);
}

export function normalizeAnswer(value: unknown): string {
  return String(value ?? '').trim().toLowerCase();
}

export function getWeekStartDate(date = new Date()): Date {
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = start.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setUTCDate(start.getUTCDate() + diff);
  start.setUTCHours(0, 0, 0, 0);
  return start;
}
