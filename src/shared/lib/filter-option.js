// URL 쿼리 값(문자열)과 일치하는 필터 옵션을 찾는다 (id가 숫자여도 문자열로 비교)
export const findOption = (options, value) =>
  options.find(({ id }) => id.toString() === value);
