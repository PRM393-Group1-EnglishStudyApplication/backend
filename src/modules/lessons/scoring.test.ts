import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateScore, deductHearts, isAnswerCorrect, isPassing, PASS_SCORE } from './scoring.js';

describe('scoring.isAnswerCorrect', () => {
  it('khop khong phan biet hoa thuong va khoang trang', () => {
    assert.equal(isAnswerCorrect('  Xin Chao ', ['xin chao']), true);
  });

  it('khop voi mot trong nhieu dap an duoc chap nhan', () => {
    assert.equal(isAnswerCorrect('hello', ['xin chao', 'hello', 'chao']), true);
  });

  it('tra ve false khi sai', () => {
    assert.equal(isAnswerCorrect('goodbye', ['hello']), false);
  });

  it('bo qua cac dap an rong/null', () => {
    assert.equal(isAnswerCorrect('hello', [null, undefined, '', 'hello']), true);
  });
});

describe('scoring.calculateScore', () => {
  it('tinh dung phan tram va lam tron', () => {
    assert.equal(calculateScore(1, 3), 33);
    assert.equal(calculateScore(2, 3), 67);
    assert.equal(calculateScore(5, 5), 100);
    assert.equal(calculateScore(0, 4), 0);
  });

  it('khong chia cho 0', () => {
    assert.equal(calculateScore(0, 0), 0);
  });
});

describe('scoring.deductHearts', () => {
  it('tru tim theo so cau sai', () => {
    assert.equal(deductHearts(5, 2), 3);
  });

  it('khong cho xuong duoi 0', () => {
    assert.equal(deductHearts(1, 3), 0);
  });

  it('khong tang khi so cau sai am', () => {
    assert.equal(deductHearts(5, -2), 5);
  });
});

describe('scoring.isPassing', () => {
  it(`dat khi >= ${PASS_SCORE}`, () => {
    assert.equal(isPassing(70), true);
    assert.equal(isPassing(100), true);
    assert.equal(isPassing(69), false);
  });
});
