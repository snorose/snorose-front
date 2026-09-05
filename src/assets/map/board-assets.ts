import besookt from '@/assets/images/besookt-board-page.svg';
import event from '@/assets/images/event-board-page.svg';
import eventMain from '@/assets/images/event-main.svg';
import financeAudit from '@/assets/images/financeAudit-board-page.svg';
import firstSnow from '@/assets/images/firstSnow-board-page.svg';
import firstSnowMain from '@/assets/images/firstSnow-main.svg';
import graduationPreparation from '@/assets/images/graduationPreparation-board-page.svg';
import largeSnow from '@/assets/images/largeSnow-board-page.svg';
import largeSnowMain from '@/assets/images/largeSnow-main.svg';
import permanentSnow from '@/assets/images/permanentSnow-board-page.svg';
import permanentSnowMain from '@/assets/images/permanentSnow-main.svg';
import residence from '@/assets/images/residence.svg';
import sookPlace from '@/assets/images/sookPlace.svg';
import studentCouncil from '@/assets/images/studentCouncil-board-page.svg';

import type { BoardKey } from '@/types';

export interface BoardImageLayout {
  top: string;
  right: string;
  bottom?: string;
}

interface BoardImages {
  category: string; // 게시판 카테고리 이미지
  categoryLayout: BoardImageLayout;
  main?: string; // 메인 화면용
}

export const BOARD_IMAGES: Partial<Record<BoardKey, BoardImages>> = {
  'first-snow': {
    category: firstSnow,
    categoryLayout: { top: '0rem', right: '0.6rem' },
    main: firstSnowMain,
  },
  'large-snow': {
    category: largeSnow,
    categoryLayout: { top: '0rem', right: '0rem' },
    main: largeSnowMain,
  },
  'permanent-snow': {
    category: permanentSnow,
    categoryLayout: { top: '0rem', right: '0rem' },
    main: permanentSnowMain,
  },
  besookt: {
    category: besookt,
    categoryLayout: { top: '2.6rem', right: '2.7rem' },
  },
  'student-council': {
    category: studentCouncil,
    categoryLayout: { top: '1.6rem', right: '1.9rem' },
  },
  'graduation-preparation': {
    category: graduationPreparation,
    categoryLayout: { top: '1.5rem', right: '0.4rem' },
  },
  'finance-audit': {
    category: financeAudit,
    categoryLayout: { top: '2.9rem', right: '1.2rem' },
  },
  event: {
    category: event,
    categoryLayout: { top: '0rem', right: '0.2rem' },
    main: eventMain,
  },
  sookplace: {
    category: sookPlace,
    categoryLayout: { top: '1.4rem', right: '3.1rem' },
  },
  residence: {
    category: residence,
    categoryLayout: { top: '2.7rem', right: '2.5rem' },
  },
};
