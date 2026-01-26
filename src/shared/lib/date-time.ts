const MINUTE_SECONDS = 60;
const HOUR_SECONDS = MINUTE_SECONDS * 60;
const DAY_SECONDS = HOUR_SECONDS * 24;
const MONTH_SECONDS = DAY_SECONDS * 30;
const YEAR_SECONDS = DAY_SECONDS * 365;
const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'] as const;

type DateTimeFormat = 'ISO' | 'YMD_HM' | 'YMD' | 'YMD_D' | 'MD_HM' | 'HM';

export function format(
  input: Date | string,
  format: DateTimeFormat = 'YMD_HM'
): string {
  const date = toValidDate(input);

  if (!date) {
    return '';
  }

  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const HH = pad(date.getHours());
  const min = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  const day = date.getDay();

  switch (format) {
    case 'ISO':
      return `${yyyy}-${mm}-${dd}T${HH}:${min}:${ss}`;
    case 'YMD_HM':
      return `${yyyy}/${mm}/${dd} ${HH}:${min}`;
    case 'YMD':
      return `${yyyy}/${mm}/${dd}`;
    case 'YMD_D':
      return `${yyyy}/${mm}/${dd} (${WEEKDAY_KO[day]})`;
    case 'MD_HM':
      return `${mm}/${dd} ${HH}:${min}`;
    case 'HM':
      return `${HH}:${min}`;
  }
}

/**
 * same day: time ago or HH:MM
 * same year: MM/DD HH:MM
 * other year: YYYY/MM/DD HH:MM
 */
export function formatAdaptive(input: Date | string): string {
  const date = toValidDate(input);

  if (!date) {
    return '';
  }

  const now = new Date();

  if (isToday(date)) {
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    return diffInSeconds < HOUR_SECONDS ? timeAgo(date) : format(date, 'HM');
  }

  return date.getFullYear() === now.getFullYear()
    ? format(date, 'MD_HM')
    : format(date, 'YMD_HM');
}

export function timeAgo(input: Date | string): string {
  const date = toValidDate(input);

  if (!date) {
    return '';
  }

  const now = new Date();
  let seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < MINUTE_SECONDS) {
    return '방금 전';
  } else if (seconds < HOUR_SECONDS) {
    const minutes = Math.floor(seconds / MINUTE_SECONDS);
    return `${minutes}분 전`;
  } else if (seconds < DAY_SECONDS) {
    const hours = Math.floor(seconds / HOUR_SECONDS);
    return `${hours}시간 전`;
  } else if (seconds < MONTH_SECONDS) {
    const days = Math.floor(seconds / DAY_SECONDS);
    return `${days}일 전`;
  } else if (seconds < YEAR_SECONDS) {
    const months = Math.floor(seconds / MONTH_SECONDS);
    return `${months}달 전`;
  } else {
    const years = Math.floor(seconds / YEAR_SECONDS);
    return `${years}년 전`;
  }
}

export function isToday(input: Date | string): boolean {
  const date = toValidDate(input);

  if (!date) {
    return false;
  }

  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function isDayOver(input: Date | string): boolean {
  const date = toValidDate(input);

  if (!date) {
    return false;
  }

  const today = new Date();

  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return d < t;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function toValidDate(input: Date | string): Date | null {
  const date = typeof input === 'string' ? new Date(input) : input;

  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
}
