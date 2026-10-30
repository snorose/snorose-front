// 게시글 목록 조회 연도 필터 범위 (API year 파라미터)
// 시작 연도: 운영 서버의 가장 오래된 게시글 연도
const POST_YEAR_START = 2015;

// 해가 바뀌어도 반영되도록 호출 시점의 연도를 기준으로 만든다
export const getPostYearOptions = () => {
  const currentYear = new Date().getFullYear();

  return Array.from(
    { length: currentYear - POST_YEAR_START + 1 },
    (_, index) => {
      const year = currentYear - index;
      return { id: year, name: String(year) };
    }
  );
};
