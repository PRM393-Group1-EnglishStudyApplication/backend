import { after, before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import mongoose, { Types } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ApiError } from '../../utils/ApiError.js';
import { VocabularyModel } from '../vocabulary/model.js';
import { UserFavoriteVocabularyModel } from './model.js';
import { addFavorite, listMyFavorites, removeFavorite } from './service.js';

let memoryServer: MongoMemoryServer;
const userId = new Types.ObjectId().toString();
const otherUserId = new Types.ObjectId().toString();

async function seedVocabulary(word: string, meaning: string) {
  const vocab = await VocabularyModel.create({ word, meaning });
  return vocab._id.toString();
}

before(async () => {
  memoryServer = await MongoMemoryServer.create();
  await mongoose.connect(memoryServer.getUri());
});

after(async () => {
  await mongoose.disconnect();
  await memoryServer.stop();
});

beforeEach(async () => {
  await UserFavoriteVocabularyModel.deleteMany({});
  await VocabularyModel.deleteMany({});
});

describe('favorites.addFavorite', () => {
  it('them tu vung vao favorites', async () => {
    const vocabId = await seedVocabulary('hello', 'xin chao');

    const favorite = await addFavorite(userId, vocabId);

    assert.equal(favorite!.user_id.toString(), userId);
    assert.equal(favorite!.vocabulary_id.toString(), vocabId);

    const count = await UserFavoriteVocabularyModel.countDocuments({});
    assert.equal(count, 1);
  });

  it('idempotent - them lai cung tu vung khong tao ban ghi trung', async () => {
    const vocabId = await seedVocabulary('hello', 'xin chao');

    const first = await addFavorite(userId, vocabId);
    const second = await addFavorite(userId, vocabId);

    assert.equal(first!._id.toString(), second!._id.toString());
    const count = await UserFavoriteVocabularyModel.countDocuments({});
    assert.equal(count, 1);
  });

  it('nem 404 khi vocabulary khong ton tai', async () => {
    const missingVocabId = new Types.ObjectId().toString();

    await assert.rejects(
      () => addFavorite(userId, missingVocabId),
      (err) => err instanceof ApiError && err.statusCode === 404
    );
  });

  it('nem 400 khi vocabularyId khong hop le', async () => {
    await assert.rejects(
      () => addFavorite(userId, 'not-an-objectid'),
      (err) => err instanceof ApiError && err.statusCode === 400
    );
  });
});

describe('favorites.listMyFavorites', () => {
  it('tra ve favorites kem chi tiet tu vung, moi nhat truoc', async () => {
    const helloId = await seedVocabulary('hello', 'xin chao');
    const worldId = await seedVocabulary('world', 'the gioi');

    await addFavorite(userId, helloId);
    await addFavorite(userId, worldId);

    const favorites = await listMyFavorites(userId);

    assert.equal(favorites.length, 2);
    // sort created_at giam dan -> world (them sau) dung truoc
    assert.equal(favorites[0]!.vocabulary_id.toString(), worldId);
    assert.equal(favorites[0]!.vocabulary?.word, 'world');
    assert.equal(favorites[1]!.vocabulary?.word, 'hello');
  });

  it('chi tra ve favorites cua chinh user do', async () => {
    const vocabId = await seedVocabulary('hello', 'xin chao');
    await addFavorite(userId, vocabId);
    await addFavorite(otherUserId, vocabId);

    const mine = await listMyFavorites(userId);
    assert.equal(mine.length, 1);
    assert.equal(mine[0]!.user_id.toString(), userId);
  });

  it('tra ve mang rong khi chua co favorite', async () => {
    const favorites = await listMyFavorites(userId);
    assert.deepEqual(favorites, []);
  });
});

describe('favorites.removeFavorite', () => {
  it('xoa favorite thanh cong', async () => {
    const vocabId = await seedVocabulary('hello', 'xin chao');
    await addFavorite(userId, vocabId);

    await removeFavorite(userId, vocabId);

    const count = await UserFavoriteVocabularyModel.countDocuments({});
    assert.equal(count, 0);
  });

  it('nem 404 khi favorite khong ton tai', async () => {
    const vocabId = await seedVocabulary('hello', 'xin chao');

    await assert.rejects(
      () => removeFavorite(userId, vocabId),
      (err) => err instanceof ApiError && err.statusCode === 404
    );
  });

  it('khong xoa favorite cua user khac', async () => {
    const vocabId = await seedVocabulary('hello', 'xin chao');
    await addFavorite(otherUserId, vocabId);

    await assert.rejects(
      () => removeFavorite(userId, vocabId),
      (err) => err instanceof ApiError && err.statusCode === 404
    );

    const count = await UserFavoriteVocabularyModel.countDocuments({});
    assert.equal(count, 1);
  });
});
