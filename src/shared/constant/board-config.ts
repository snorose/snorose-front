export const BOARD_SECTION = {
  DETAIL: 'detail',
  EDITOR: 'editor',
  NOTICE: 'notice',
  SEARCH: 'search',
} as const;

export const UNSUPPORTED_BOARD_SECTIONS = {
  'first-snow': [],
  'large-snow': [],
  'permanent-snow': [],

  besookt: [
    BOARD_SECTION.DETAIL,
    BOARD_SECTION.EDITOR,
    BOARD_SECTION.NOTICE,
    BOARD_SECTION.SEARCH,
  ],

  'student-council': [],
  'graduation-preparation': [],
  'finance-audit': [],

  'exam-review': [BOARD_SECTION.SEARCH],
  event: [BOARD_SECTION.SEARCH],
  support: [BOARD_SECTION.SEARCH],
};
