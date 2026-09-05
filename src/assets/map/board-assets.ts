import {
  IllustrationMicrophone,
  IllustrationSnowGround,
  IllustrationSnowMountain,
} from '@snorose/icons';
import type { ComponentType, SVGProps } from 'react';

import besookt from '@/assets/images/besookt-board-page.svg';
import event from '@/assets/images/event-board-page.svg';
import eventMain from '@/assets/images/event-main.svg';
import financeAudit from '@/assets/images/financeAudit-board-page.svg';
import firstSnow from '@/assets/images/firstSnow-board-page.svg';
import firstSnowMain from '@/assets/images/firstSnow-main.svg';
import graduationPreparation from '@/assets/images/graduationPreparation-board-page.svg';
import largeSnowMain from '@/assets/images/largeSnow-main.svg';
import permanentSnowMain from '@/assets/images/permanentSnow-main.svg';
import sookPlace from '@/assets/images/sookPlace.svg';

import type { BoardKey } from '@/types';

type BoardImage = ComponentType<SVGProps<SVGSVGElement>>;

interface BoardImages {
  category: BoardImage | string; // 게시판 카테고리 이미지
  main?: BoardImage | string; // 메인 화면용
}

export const BOARD_IMAGES: Partial<Record<BoardKey, BoardImages>> = {
  'first-snow': {
    category: firstSnow,
    main: firstSnowMain,
  },
  'large-snow': {
    category: IllustrationSnowGround,
    // TODO: 홈 게시판 원형 이미지는 패키지 export가 일부만 있어서 로컬 SVG로 유지한다.
    // IllustrationSnowGroundCircle, IllustrationSnowMountainCircle은 있고
    // IllustrationSnowfallCircle, IllustrationBoxStarsCircle은 없으므로 모두 준비되면 한꺼번에 교체한다.
    main: largeSnowMain,
  },
  'permanent-snow': {
    category: IllustrationSnowMountain,
    main: permanentSnowMain,
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
