import {
  IllustrationBooksCap,
  IllustrationBoxStarsCircle,
  IllustrationBoxStarsOpen,
  IllustrationFolderSearch,
  IllustrationMicrophone,
  IllustrationSnowfall,
  IllustrationSnowfallCircle,
  IllustrationSnowGround,
  IllustrationSnowGroundCircle,
  IllustrationSnowMountain,
  IllustrationSnowMountainCircle,
  IllustrationStarHonorBoard,
} from '@snorose/icons';
import type { ComponentType, SVGProps } from 'react';

import sookPlace from '@/assets/images/sookPlace.svg';

import type { BoardKey } from '@/types';

type BoardImage = ComponentType<SVGProps<SVGSVGElement>>;

interface BoardImages {
  category: BoardImage | string; // 게시판 카테고리 이미지
  main?: BoardImage | string; // 메인 화면용
}

export const BOARD_IMAGES: Partial<Record<BoardKey, BoardImages>> = {
  'first-snow': {
    category: IllustrationSnowfall,
    main: IllustrationSnowfallCircle,
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
    category: IllustrationStarHonorBoard,
  },
  'student-council': {
    category: IllustrationMicrophone,
  },
  'graduation-preparation': {
    category: IllustrationBooksCap,
  },
  'finance-audit': {
    category: IllustrationFolderSearch,
  },
  event: {
    category: IllustrationBoxStarsOpen,
    main: IllustrationBoxStarsCircle,
  },
  sookplace: {
    category: sookPlace,
  },
};
