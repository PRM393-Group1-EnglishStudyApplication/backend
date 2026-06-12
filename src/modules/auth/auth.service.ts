import { ApiError } from '../../utils/ApiError.js';
import { HeartModel } from '../hearts/model.js';
import { UserModel, type UserDocument } from './model.js';

export type ClerkUserLike = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  imageUrl?: string | null;
  primaryEmailAddressId?: string | null;
  emailAddresses?: Array<{
    id?: string;
    emailAddress?: string;
  }>;
};

export type ClerkWebhookUserLike = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
  primary_email_address_id?: string | null;
  email_addresses?: Array<{
    id?: string;
    email_address?: string;
  }>;
};

type ClerkSyncInput = {
  clerkUserId: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
};

export function getPrimaryEmailFromClerkUser(user: ClerkUserLike): string | null {
  const primaryEmail = user.emailAddresses?.find((email) => email.id === user.primaryEmailAddressId);
  return primaryEmail?.emailAddress || user.emailAddresses?.[0]?.emailAddress || null;
}

export function getFullNameFromClerkUser(user: ClerkUserLike): string | undefined {
  const joinedName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return user.fullName || joinedName || undefined;
}

export function mapClerkUser(user: ClerkUserLike): ClerkSyncInput {
  const email = getPrimaryEmailFromClerkUser(user);
  if (!email) {
    throw ApiError.badRequest('Clerk user chua co email.');
  }

  return {
    clerkUserId: user.id,
    email: email.toLowerCase().trim(),
    fullName: getFullNameFromClerkUser(user),
    avatarUrl: user.imageUrl || undefined,
  };
}

export function mapClerkWebhookUser(user: ClerkWebhookUserLike): ClerkSyncInput {
  const primaryEmail = user.email_addresses?.find((email) => email.id === user.primary_email_address_id);
  const email = primaryEmail?.email_address || user.email_addresses?.[0]?.email_address;
  if (!email) {
    throw ApiError.badRequest('Clerk webhook user chua co email.');
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || undefined;
  return {
    clerkUserId: user.id,
    email: email.toLowerCase().trim(),
    fullName,
    avatarUrl: user.image_url || undefined,
  };
}

export async function syncClerkUser(input: ClerkSyncInput): Promise<UserDocument> {
  const existingUser = await UserModel.findOne({
    $or: [{ clerk_user_id: input.clerkUserId }, { email: input.email }],
  });

  if (existingUser) {
    existingUser.clerk_user_id = input.clerkUserId;
    existingUser.email = input.email;
    existingUser.full_name = input.fullName;
    existingUser.avatar_url = input.avatarUrl;
    await existingUser.save();
    return existingUser;
  }

  const user = await UserModel.create({
    clerk_user_id: input.clerkUserId,
    full_name: input.fullName,
    email: input.email,
    avatar_url: input.avatarUrl,
    total_xp: 0,
    current_level: 'beginner',
    streak_count: 0,
    created_at: new Date(),
  });

  await HeartModel.create({
    user_id: user._id,
    current_hearts: 5,
    max_hearts: 5,
  });

  return user;
}

export async function deleteClerkUser(clerkUserId: string): Promise<void> {
  await UserModel.findOneAndDelete({ clerk_user_id: clerkUserId });
}
