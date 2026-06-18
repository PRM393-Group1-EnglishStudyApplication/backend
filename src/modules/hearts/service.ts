import { ApiError } from '../../utils/ApiError.js';
import { toObjectId } from '../../utils/mongo.js';
import { HeartModel, type IHeart } from './model.js';

export const MAX_HEARTS = 15;
export const HEART_REFILL_INTERVAL_MS = 10 * 60 * 1000;

export type HeartResponse = {
  user_id: string;
  current_hearts: number;
  max_hearts: number;
  last_refill_at: Date;
  next_refill_at: Date | null;
  seconds_until_next_refill: number | null;
};

type RefillState = {
  currentHearts: number;
  lastRefillAt: Date;
};

export function calculateHeartRefill(
  currentHearts: number,
  lastRefillAt: Date,
  now = new Date(),
  maxHearts = MAX_HEARTS
): RefillState {
  const safeCurrentHearts = Math.min(maxHearts, Math.max(0, currentHearts));
  if (safeCurrentHearts >= maxHearts) {
    return { currentHearts: maxHearts, lastRefillAt };
  }

  const elapsedMs = Math.max(0, now.getTime() - lastRefillAt.getTime());
  const refillCount = Math.floor(elapsedMs / HEART_REFILL_INTERVAL_MS);
  if (refillCount <= 0) {
    return { currentHearts: safeCurrentHearts, lastRefillAt };
  }

  return {
    currentHearts: Math.min(maxHearts, safeCurrentHearts + refillCount),
    lastRefillAt: new Date(lastRefillAt.getTime() + refillCount * HEART_REFILL_INTERVAL_MS),
  };
}

async function refreshHeart(userId: string, now: Date) {
  const userObjectId = toObjectId(userId, 'userId');
  const heart = await HeartModel.findOneAndUpdate(
    { user_id: userObjectId },
    [
      {
        $set: {
          user_id: { $ifNull: ['$user_id', userObjectId] },
          max_hearts: MAX_HEARTS,
          current_hearts: {
            $min: [
              MAX_HEARTS,
              {
                $add: [
                  { $max: [0, { $ifNull: ['$current_hearts', MAX_HEARTS] }] },
                  {
                    $cond: [
                      { $lt: [{ $ifNull: ['$current_hearts', MAX_HEARTS] }, MAX_HEARTS] },
                      {
                        $floor: {
                          $divide: [
                            {
                              $max: [
                                0,
                                {
                                  $subtract: [
                                    now,
                                    { $ifNull: ['$last_refill_at', now] },
                                  ],
                                },
                              ],
                            },
                            HEART_REFILL_INTERVAL_MS,
                          ],
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            ],
          },
          last_refill_at: {
            $add: [
              { $ifNull: ['$last_refill_at', now] },
              {
                $multiply: [
                  {
                    $cond: [
                      { $lt: [{ $ifNull: ['$current_hearts', MAX_HEARTS] }, MAX_HEARTS] },
                      {
                        $floor: {
                          $divide: [
                            {
                              $max: [
                                0,
                                {
                                  $subtract: [
                                    now,
                                    { $ifNull: ['$last_refill_at', now] },
                                  ],
                                },
                              ],
                            },
                            HEART_REFILL_INTERVAL_MS,
                          ],
                        },
                      },
                      0,
                    ],
                  },
                  HEART_REFILL_INTERVAL_MS,
                ],
              },
            ],
          },
        },
      },
    ],
    { upsert: true, returnDocument: 'after', updatePipeline: true }
  );

  return heart;
}

function toHeartResponse(heart: IHeart, now: Date): HeartResponse {
  const isFull = heart.current_hearts >= heart.max_hearts;
  const nextRefillAt = isFull
    ? null
    : new Date(heart.last_refill_at.getTime() + HEART_REFILL_INTERVAL_MS);

  return {
    user_id: heart.user_id.toString(),
    current_hearts: heart.current_hearts,
    max_hearts: heart.max_hearts,
    last_refill_at: heart.last_refill_at,
    next_refill_at: nextRefillAt,
    seconds_until_next_refill: nextRefillAt
      ? Math.max(0, Math.ceil((nextRefillAt.getTime() - now.getTime()) / 1000))
      : null,
  };
}

export async function getMyHearts(userId: string, now = new Date()): Promise<HeartResponse> {
  const heart = await refreshHeart(userId, now);
  return toHeartResponse(heart, now);
}

export async function applyLessonHeartCost(
  userId: string,
  wrongAnswers: number,
  now = new Date()
): Promise<HeartResponse> {
  const heart = await refreshHeart(userId, now);
  if (heart.current_hearts <= 0) {
    throw ApiError.forbidden('Ban da het tim. Vui long cho tim hoi lai truoc khi submit lesson.');
  }

  const heartCost = Math.max(0, wrongAnswers);
  if (heartCost > 0) {
    const updatedHeart = await HeartModel.findOneAndUpdate(
      { _id: heart._id, current_hearts: { $gt: 0 } },
      [
        {
          $set: {
            current_hearts: { $max: [0, { $subtract: ['$current_hearts', heartCost] }] },
            last_refill_at: {
              $cond: [
                { $gte: ['$current_hearts', '$max_hearts'] },
                now,
                '$last_refill_at',
              ],
            },
          },
        },
      ],
      { returnDocument: 'after', updatePipeline: true }
    );

    if (!updatedHeart) {
      throw ApiError.forbidden('Ban da het tim. Vui long cho tim hoi lai truoc khi submit lesson.');
    }
    return toHeartResponse(updatedHeart, now);
  }

  return toHeartResponse(heart, now);
}

export async function refillMyHearts(userId: string, now = new Date()): Promise<HeartResponse> {
  const heart = await HeartModel.findOneAndUpdate(
    { user_id: toObjectId(userId, 'userId') },
    {
      $set: {
        current_hearts: MAX_HEARTS,
        max_hearts: MAX_HEARTS,
        last_refill_at: now,
      },
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );

  return toHeartResponse(heart, now);
}
