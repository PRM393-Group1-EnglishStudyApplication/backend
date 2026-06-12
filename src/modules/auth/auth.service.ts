import type { User } from '@prisma/client';
import { prisma } from '../../config/prisma.js';

// Tim User trong DB theo Clerk user id (sub trong JWT).
// Dung cho requireAuth middleware - WBS 2.0
export function findUserByClerkId(clerkUserId: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { clerkUserId } });
}
