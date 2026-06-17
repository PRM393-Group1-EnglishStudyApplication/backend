import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ApiError } from './ApiError.js';
import { getWeekStartDate, normalizeAnswer } from './mongo.js';

describe('ApiError factories', () => {
  it('gan dung status code', () => {
    assert.equal(ApiError.badRequest().statusCode, 400);
    assert.equal(ApiError.unauthorized().statusCode, 401);
    assert.equal(ApiError.forbidden().statusCode, 403);
    assert.equal(ApiError.notFound().statusCode, 404);
    assert.equal(ApiError.conflict().statusCode, 409);
  });

  it('danh dau la loi van hanh', () => {
    assert.equal(ApiError.badRequest('x').isOperational, true);
  });
});

describe('normalizeAnswer', () => {
  it('trim + lowercase', () => {
    assert.equal(normalizeAnswer('  Hello WORLD '), 'hello world');
  });

  it('xu ly null/undefined thanh chuoi rong', () => {
    assert.equal(normalizeAnswer(null), '');
    assert.equal(normalizeAnswer(undefined), '');
  });
});

describe('getWeekStartDate', () => {
  it('tra ve thu Hai dau tuan (UTC)', () => {
    // 2026-06-13 = thu 7 -> dau tuan la 2026-06-08 (thu 2)
    const start = getWeekStartDate(new Date(Date.UTC(2026, 5, 13)));
    assert.equal(start.getUTCFullYear(), 2026);
    assert.equal(start.getUTCMonth(), 5);
    assert.equal(start.getUTCDate(), 8);
    assert.equal(start.getUTCDay(), 1);
  });

  it('chu nhat thuoc ve tuan truoc do', () => {
    // 2026-06-14 = chu nhat -> dau tuan van la 2026-06-08
    const start = getWeekStartDate(new Date(Date.UTC(2026, 5, 14)));
    assert.equal(start.getUTCDate(), 8);
  });
});
