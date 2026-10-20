/**
 * Bangla Number and Date Utilities
 */

const banglaDigits: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

const banglaMonths = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

const numberWords: Record<number, string> = {
  1: 'এক',
  2: 'দুই',
  3: 'তিন',
  4: 'চার',
  5: 'পাঁচ',
  6: 'ছয়',
  7: 'সাত',
  8: 'আট',
  9: 'নয়',
  10: 'দশ',
  11: 'এগারো',
  12: 'বারো',
  13: 'তেরো',
  14: 'চৌদ্দ',
  15: 'পনেরো',
  16: 'ষোলো',
  17: 'সতেরো',
  18: 'আঠারো',
  19: 'উনিশ',
  20: 'বিশ',
  21: 'একুশ',
  25: 'পঁচিশ',
  30: 'ত্রিশ',
};

/**
 * Converts any string with English digits to Bengali digits
 */
export function toBanglaNumber(input: number | string | undefined | null): string {
  if (input === undefined || input === null) return '';
  return input
    .toString()
    .replace(/[0-9]/g, (digit) => banglaDigits[digit] || digit);
}

/**
 * Converts date (YYYY-MM-DD or Date object) to standard Bengali written date (e.g., ১৯ অক্টোবর ২০২৬)
 */
export function toBanglaDate(dateInput?: string | Date): string {
  if (!dateInput) {
    dateInput = new Date();
  }
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    return '';
  }

  const day = date.getDate();
  const month = banglaMonths[date.getMonth()];
  const year = date.getFullYear();

  return `${toBanglaNumber(day)} ${month} ${toBanglaNumber(year)}`;
}

/**
 * Returns current date formatted as YYYY-MM-DD
 */
export function getTodayISODate(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Computes duration between two ISO date strings and returns formal Bengali phrasing like "৩ (তিন) দিন"
 */
export function calculateBanglaDuration(startDateStr?: string, endDateStr?: string): { days: number; text: string } {
  if (!startDateStr || !endDateStr) {
    return { days: 1, text: '১ (এক) দিন' };
  }

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return { days: 1, text: '১ (এক) দিন' };
  }

  // Calculate inclusive calendar days
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const numBengali = toBanglaNumber(diffDays);
  const wordBengali = numberWords[diffDays] || '';

  if (wordBengali) {
    return { days: diffDays, text: `${numBengali} (${wordBengali}) দিন` };
  }
  return { days: diffDays, text: `${numBengali} দিন` };
}
