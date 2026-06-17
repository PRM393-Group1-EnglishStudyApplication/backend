import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isReminderDue, isValidTimeString } from './reminder.js';

// 2026-06-13 la Thu Bay (getUTCDay() === 6)
const at = (h: number, m: number) => new Date(Date.UTC(2026, 5, 13, h, m, 0));

describe('reminder.isValidTimeString', () => {
  it('chap nhan HH:mm hop le', () => {
    assert.equal(isValidTimeString('00:00'), true);
    assert.equal(isValidTimeString('19:30'), true);
    assert.equal(isValidTimeString('23:59'), true);
  });

  it('tu choi gia tri sai', () => {
    assert.equal(isValidTimeString('24:00'), false);
    assert.equal(isValidTimeString('7:5'), false);
    assert.equal(isValidTimeString('19h30'), false);
  });
});

describe('reminder.isReminderDue', () => {
  it('dung gio, moi ngay -> due', () => {
    assert.equal(isReminderDue({ enabled: true, time: '19:00', days: [] }, at(19, 0)), true);
  });

  it('sai phut -> khong due', () => {
    assert.equal(isReminderDue({ enabled: true, time: '19:00', days: [] }, at(19, 1)), false);
  });

  it('tat -> khong due', () => {
    assert.equal(isReminderDue({ enabled: false, time: '19:00', days: [] }, at(19, 0)), false);
  });

  it('chi gui dung thu trong tuan', () => {
    // 13/6/2026 = thu 7 (6)
    assert.equal(isReminderDue({ enabled: true, time: '19:00', days: [6] }, at(19, 0)), true);
    assert.equal(isReminderDue({ enabled: true, time: '19:00', days: [1, 2, 3] }, at(19, 0)), false);
  });

  it('time khong hop le -> khong due', () => {
    assert.equal(isReminderDue({ enabled: true, time: 'bad', days: [] }, at(19, 0)), false);
  });
});
