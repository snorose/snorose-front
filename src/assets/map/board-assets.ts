import type { BoardKey } from '@/types';

import firstSnowMain from '@/assets/images/firstSnow-main.svg';
import largeSnowMain from '@/assets/images/largeSnow-main.svg';
import permanentSnowMain from '@/assets/images/permanentSnow-main.svg';
import eventMain from '@/assets/images/event-main.svg';

import firstSnow from '@/assets/images/firstSnow-board-page.svg';
import largeSnow from '@/assets/images/largeSnow-board-page.svg';
import permanentSnow from '@/assets/images/permanentSnow-board-page.svg';
import besookt from '@/assets/images/besookt-board-page.svg';

import studentCouncil from '@/assets/images/studentCouncil-board-page.svg';
import graduationPreparation from '@/assets/images/graduationPreparation-board-page.svg';
import financeAudit from '@/assets/images/financeAudit-board-page.svg';

import event from '@/assets/images/event-board-page.svg';

interface BoardImages {
  category: string; // 게시판 카테고리 이미지
  main?: string; // 메인 화면용
}

export const BOARD_IMAGES: Partial<Record<BoardKey, BoardImages>> = {
  'first-snow': {
    category: firstSnow,
    main: firstSnowMain,
  },
  'large-snow': {
    category: largeSnow,
    main: largeSnowMain,
  },
  'permanent-snow': {
    category: permanentSnow,
    main: permanentSnowMain,
  },
  besookt: {
    category: besookt,
  },
  'student-council': {
    category: studentCouncil,
  },
  'graduation-preparation': {
    category: graduationPreparation,
  },
  'finance-audit': {
    category: financeAudit,
  },
  event: {
    category: event,
    main: eventMain,
  },
};
