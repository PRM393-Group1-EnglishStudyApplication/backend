import { Schema, model, type Types } from 'mongoose';

// Tu vung user da danh dau yeu thich (favorite)
export interface IUserFavoriteVocabulary {
  user_id: Types.ObjectId;
  vocabulary_id: Types.ObjectId;
  created_at?: Date;
}

const userFavoriteVocabularySchema = new Schema<IUserFavoriteVocabulary>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vocabulary_id: { type: Schema.Types.ObjectId, ref: 'Vocabulary', required: true },
    created_at: { type: Date, default: () => new Date() },
  },
  { versionKey: false }
);

userFavoriteVocabularySchema.index({ user_id: 1, vocabulary_id: 1 }, { unique: true });

export const UserFavoriteVocabularyModel = model<IUserFavoriteVocabulary>(
  'UserFavoriteVocabulary',
  userFavoriteVocabularySchema,
  'user_favorite_vocabulary'
);
