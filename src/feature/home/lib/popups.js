const KST_OFFSET = 9 * 60 * 60 * 1000;

export function getKstDate(now = new Date()) {
  return new Date(now.getTime() + KST_OFFSET).toISOString().slice(0, 10);
}

export function addDateDays(date, days) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * 86400000)
    .toISOString()
    .slice(0, 10);
}

export function getActivePopups(popups, now = new Date()) {
  const today = getKstDate(now);
  return popups
    .filter((popup) => popup.startDate <= today && today <= popup.endDate)
    .sort(
      (first, second) =>
        first.displayOrder - second.displayOrder || first.id - second.id
    );
}

export function isPopupHidden(now = new Date()) {
  try {
    if (localStorage.getItem('popUpState') !== 'hidden') return false;
    const saved = localStorage.getItem('popUpDate');
    if (!saved) return false;
    const until = /^\d{4}-\d{2}-\d{2}$/.test(saved)
      ? saved
      : getKstDate(new Date(saved));
    return getKstDate(now) <= until;
  } catch {
    return false;
  }
}

export function hidePopups(duration, now = new Date()) {
  if (duration === undefined) return;
  try {
    localStorage.setItem('popUpDate', addDateDays(getKstDate(now), duration));
    localStorage.setItem('popUpState', 'hidden');
  } catch {
    // 저장소를 사용할 수 없어도 현재 화면의 닫기는 동작한다.
  }
}
