// Logic lich nhac hoc thuan (khong phu thuoc DB) -> de unit test (WBS 7.0)

export function isValidTimeString(time: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

export interface ReminderScheduleLike {
  enabled: boolean;
  time: string; // 'HH:mm' UTC
  days: number[]; // 0-6, rong = moi ngay
}

// Kiem tra co phai dung gio gui nhac khong (so theo phut, theo gio UTC)
export function isReminderDue(setting: ReminderScheduleLike, now: Date): boolean {
  if (!setting.enabled) {
    return false;
  }
  if (!isValidTimeString(setting.time)) {
    return false;
  }
  const day = now.getUTCDay();
  if (setting.days.length > 0 && !setting.days.includes(day)) {
    return false;
  }
  const hh = String(now.getUTCHours()).padStart(2, '0');
  const mm = String(now.getUTCMinutes()).padStart(2, '0');
  return setting.time === `${hh}:${mm}`;
}
