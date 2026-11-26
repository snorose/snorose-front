import {
  addDateDays,
  getActivePopups,
  getKstDate,
  hidePopups,
  isPopupHidden,
} from './popups';

beforeEach(() => localStorage.clear());
const beforeMidnight = new Date('2026-10-20T14:59:59Z');
const afterMidnight = new Date('2026-10-20T15:00:00Z');

test('KST 날짜 경계와 같은 날 시작·종료를 포함해 노출 순서로 정렬한다', () => {
  const data = [
    { id: 2, displayOrder: 1, startDate: '2026-10-20', endDate: '2026-10-20' },
    { id: 1, displayOrder: 0, startDate: '2026-10-20', endDate: '2026-10-22' },
    { id: 3, displayOrder: 2, startDate: '2026-10-22', endDate: '2026-10-23' },
  ];
  expect(getKstDate(beforeMidnight)).toBe('2026-10-20');
  expect(getKstDate(afterMidnight)).toBe('2026-10-21');
  expect(
    getActivePopups(data, beforeMidnight).map((popup) => popup.id)
  ).toEqual([1, 2]);
  expect(getActivePopups(data, afterMidnight).map((popup) => popup.id)).toEqual(
    [1]
  );
  expect(data[0].id).toBe(2);
});
test('오늘 하루 숨김은 다음 KST 자정에 만료한다', () => {
  hidePopups(0, beforeMidnight);
  expect(isPopupHidden(beforeMidnight)).toBe(true);
  expect(isPopupHidden(afterMidnight)).toBe(false);
});
test('3일간 숨김은 오늘을 포함해 3일 적용한다', () => {
  hidePopups(2, beforeMidnight);
  expect(isPopupHidden(new Date('2026-10-22T14:59:59Z'))).toBe(true);
  expect(isPopupHidden(new Date('2026-10-22T15:00:00Z'))).toBe(false);
});
test('일반 닫기는 저장하지 않고 잘못된 저장값은 무시한다', () => {
  hidePopups(undefined, beforeMidnight);
  expect(localStorage.getItem('popUpState')).toBeNull();
  localStorage.setItem('popUpState', 'hidden');
  localStorage.setItem('popUpDate', 'invalid');
  expect(isPopupHidden()).toBe(false);
});
test('기존 Date 문자열 숨김 데이터를 읽고 월·연도 경계를 처리한다', () => {
  localStorage.setItem('popUpState', 'hidden');
  localStorage.setItem('popUpDate', beforeMidnight.toString());
  expect(isPopupHidden(beforeMidnight)).toBe(true);
  expect(addDateDays('2026-12-31', 2)).toBe('2027-01-02');
});
test('저장소 사용이 제한되어도 닫기 처리가 실패하지 않는다', () => {
  const get = jest
    .spyOn(Storage.prototype, 'getItem')
    .mockImplementation(() => {
      throw new Error('blocked');
    });
  const set = jest
    .spyOn(Storage.prototype, 'setItem')
    .mockImplementation(() => {
      throw new Error('blocked');
    });
  expect(isPopupHidden()).toBe(false);
  expect(() => hidePopups(0)).not.toThrow();
  get.mockRestore();
  set.mockRestore();
});
