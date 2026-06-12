import { toObjectId } from '../../utils/mongo.js';
import { HeartModel } from './model.js';

export function getMyHearts(userId: string) {
  return HeartModel.findOneAndUpdate(
    { user_id: toObjectId(userId, 'userId') },
    { $setOnInsert: { current_hearts: 5, max_hearts: 5 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

export function refillMyHearts(userId: string) {
  return HeartModel.findOneAndUpdate(
    { user_id: toObjectId(userId, 'userId') },
    [
      {
        $set: {
          current_hearts: '$max_hearts',
          last_refill_at: new Date(),
        },
      },
    ],
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}
