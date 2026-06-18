import { normalizeAnswer } from '../../utils/mongo.js';

// Logic cham diem thuan (khong phu thuoc DB) -> de viet unit test (WBS 7.0)
export const PASS_SCORE = 70;

// So sanh cau tra loi cua user voi danh sach dap an duoc chap nhan (da chuan hoa)
export function isAnswerCorrect(userAnswer: unknown, acceptedRawAnswers: Array<unknown>): boolean {
  const normalizedUser = normalizeAnswer(userAnswer);
  const accepted = acceptedRawAnswers.filter(Boolean).map((value) => normalizeAnswer(value));
  return accepted.includes(normalizedUser);
}

// Tinh diem tren thang 100
export function calculateScore(correctAnswers: number, totalQuestions: number): number {
  if (totalQuestions <= 0) {
    return 0;
  }
  return Math.round((correctAnswers / totalQuestions) * 100);
}

// Tru "Tim" theo so cau sai, khong cho xuong duoi 0
export function deductHearts(currentHearts: number, wrongAnswers: number): number {
  return Math.max(0, currentHearts - Math.max(0, wrongAnswers));
}

// Dat diem dau cua bai hoc hay chua
export function isPassing(score: number): boolean {
  return score >= PASS_SCORE;
}
