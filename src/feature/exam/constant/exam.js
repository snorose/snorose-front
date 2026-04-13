export const FILE_MAX_SIZE = 1024 * 1024 * 10;

export const EXAM_TYPES = Object.freeze([
  { id: 'MIDTERM', name: '중간고사' },
  { id: 'FINALTERM', name: '기말고사' },
]);

export const LECTURE_TYPES = Object.freeze([
  { id: 'MAJOR_REQUIRED', name: '전공필수' },
  { id: 'MAJOR_ELECTIVE', name: '전공선택' },
  { id: 'GENERAL_REQUIRED', name: '교양필수' },
  { id: 'GENERAL_ELECTIVE', name: '교양선택' },
  { id: 'OTHER', name: '기타' },
]);

export const SEMESTERS = Object.freeze([
  {
    id: 'FIRST',
    name: '1학기',
  },
  {
    id: 'SUMMER',
    name: '여름학기',
  },
  {
    id: 'SECOND',
    name: '2학기',
  },
  {
    id: 'WINTER',
    name: '겨울학기',
  },
]);

export const YEARS = Object.freeze(
  [
    { id: 2026, name: '2026' },
    { id: 2025, name: '2025' },
    { id: 2024, name: '2024' },
    { id: 2023, name: '2023' },
    { id: 2022, name: '2022' },
    { id: 2021, name: '2021' },
    { id: 2020, name: '2020' },
    { id: 2019, name: '2019' },
    { id: 2018, name: '2018' },
    { id: 2017, name: '2017' },
    { id: 2016, name: '2016' },
    { id: 2015, name: '2015' },
    { id: 2014, name: '2014' },
    { id: 2013, name: '2013' },
    { id: 2012, name: '2012' },
    { id: 2011, name: '2011' },
    { id: 2010, name: '2010' },
    { id: 2009, name: '2009' },
    { id: 2008, name: '2008' },
    { id: 2007, name: '2007' },
    { id: 2006, name: '2006' },
    { id: 2005, name: '2005' },
    { id: 2004, name: '2004' },
    { id: 2003, name: '2003' },
    { id: 2002, name: '2002' },
  ].sort((a, b) => b.id - a.id)
);
