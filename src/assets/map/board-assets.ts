import {
  IllustrationMicrophone,
  IllustrationSnowGround,
  IllustrationSnowGroundCircle,
  IllustrationSnowMountain,
  IllustrationSnowMountainCircle,
} from '@snorose/icons';
import type { ComponentType, SVGProps } from 'react';

import besookt from '@/assets/images/besookt-board-page.svg';
import event from '@/assets/images/event-board-page.svg';
import eventMain from '@/assets/images/event-main.svg';
import financeAudit from '@/assets/images/financeAudit-board-page.svg';
import firstSnow from '@/assets/images/firstSnow-board-page.svg';
import firstSnowMain from '@/assets/images/firstSnow-main.svg';
import graduationPreparation from '@/assets/images/graduationPreparation-board-page.svg';
import sookPlace from '@/assets/images/sookPlace.svg';

import type { BoardKey } from '@/types';

interface BoardImages {
  category: string | ComponentType<SVGProps<SVGSVGElement>>; // 게시판 카테고리 이미지
  main?: string | ComponentType<SVGProps<SVGSVGElement>>; // 메인 화면용
}

export const BOARD_IMAGES: Partial<Record<BoardKey, BoardImages>> = {
  'first-snow': {
    category: firstSnow,
    main: firstSnowMain,
  },
  'large-snow': {
    category: IllustrationSnowGround,
    main: IllustrationSnowGroundCircle,
  },
  'permanent-snow': {
    category: IllustrationSnowMountain,
    main: IllustrationSnowMountainCircle,
  },
  besookt: {
    category: besookt,
  },
  'student-council': {
    category: IllustrationMicrophone,
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
  sookplace: {
    category: sookPlace,
  },
};
