export type Role = (typeof ROLE)[keyof typeof ROLE];

export const ROLE = Object.freeze({
  preUser: 1,
  user: 2,
  user2: 3,
  admin: 4,
  official: 5,
  blacklist: 6,
  advertiser: 7,
});

export const ROLE_NAME = Object.freeze({
  1: '준회원',
  2: '정회원',
  3: '정회원2',
  4: '리자',
  5: '공식계정',
  6: '강등/영구강등',
  7: '광고주',
});

const ReadPermissionMatrix = {
  notice: [
    ROLE.preUser,
    ROLE.user,
    ROLE.admin,
    ROLE.official,
    ROLE.blacklist,
    ROLE.advertiser,
  ],
  'first-snow': [ROLE.preUser, ROLE.user, ROLE.admin, ROLE.official],
  'large-snow': [ROLE.user, ROLE.admin, ROLE.official],
  'permanent-snow': [ROLE.user, ROLE.admin, ROLE.official],
  besookt: [ROLE.user, ROLE.admin, ROLE.official],
  'student-council': [ROLE.user, ROLE.admin, ROLE.official],
  'graduation-preparation': [ROLE.user, ROLE.admin, ROLE.official],
  'finance-audit': [ROLE.user, ROLE.admin, ROLE.official],
  'exam-review': [ROLE.user, ROLE.admin],
  event: [ROLE.user, ROLE.admin, ROLE.advertiser],
} as const;

const WritePermissionMatrix = {
  notice: [ROLE.admin, ROLE.official],
  'first-snow': [ROLE.preUser, ROLE.user, ROLE.admin, ROLE.official],
  'large-snow': [ROLE.user, ROLE.admin],
  'permanent-snow': [ROLE.user, ROLE.admin],
  besookt: [],
  'student-council': [ROLE.admin, ROLE.official],
  'finance-audit': [ROLE.admin, ROLE.official],
  'graduation-preparation': [ROLE.admin, ROLE.official],
  'exam-review': [ROLE.user, ROLE.admin],
  event: [ROLE.admin],
} as const;

export const PERMISSION_MATRIX = {
  read: ReadPermissionMatrix,
  write: WritePermissionMatrix,
  admin: [ROLE.admin],
} as const;

export const PRIVATE_USER_INFO_UPDATE_PERMISSION_ROLE_ID_LIST = [1];
