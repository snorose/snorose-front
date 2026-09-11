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

import residence from '@/assets/images/residence.svg';
import sookPlace from '@/assets/images/sookPlace.svg';

import type { BoardKey } from '@/types';

type BoardImage = ComponentType<SVGProps<SVGSVGElement>>;

export interface BoardImageLayout {
  right: string;
  bottom: string;
  width: string;
  height: string;
}

interface BoardImages {
  category: BoardImage | string; // 게시판 카테고리 이미지
  categoryLayout: BoardImageLayout;
  main?: BoardImage | string; // 메인 화면용
}

export const BOARD_IMAGES: Partial<Record<BoardKey, BoardImages>> = {
  'first-snow': {
    category: IllustrationSnowfall,
    categoryLayout: {
      right: '0.6rem',
      bottom: '0.6rem',
      width: '19.5rem',
      height: '9.2rem',
    },
    main: IllustrationSnowfallCircle,
  },
  'large-snow': {
    category: IllustrationSnowGround,
    categoryLayout: {
      right: '0rem',
      bottom: '0rem',
      width: '21.9rem',
      height: '9.8rem',
    },
    main: IllustrationSnowGroundCircle,
  },
  'permanent-snow': {
    category: IllustrationSnowMountain,
    categoryLayout: {
      right: '0rem',
      bottom: '0rem',
      width: '21.5rem',
      height: '9.8rem',
    },
    main: IllustrationSnowMountainCircle,
  },
  besookt: {
    category: IllustrationStarHonorBoard,
    categoryLayout: {
      right: '2.7rem',
      bottom: '0rem',
      width: '9rem',
      height: '7.2rem',
    },
  },
  'student-council': {
    category: IllustrationMicrophone,
    categoryLayout: {
      right: '1.9rem',
      bottom: '0rem',
      width: '10.7rem',
      height: '8.2rem',
    },
  },
  'graduation-preparation': {
    category: IllustrationBooksCap,
    categoryLayout: {
      right: '0.4rem',
      bottom: '0.4rem',
      width: '14.3rem',
      height: '7.9rem',
    },
  },
  'finance-audit': {
    category: IllustrationFolderSearch,
    categoryLayout: {
      right: '1.2rem',
      bottom: '0rem',
      width: '13.2rem',
      height: '6.9rem',
    },
  },
  event: {
    category: IllustrationBoxStarsOpen,
    categoryLayout: {
      right: '0.2rem',
      bottom: '0rem',
      width: '14.1rem',
      height: '11.1rem',
    },
    main: IllustrationBoxStarsCircle,
  },
  sookplace: {
    category: sookPlace,
    categoryLayout: {
      right: '3.1rem',
      bottom: '1.2rem',
      width: '8.7rem',
      height: '7.2rem',
    },
  },
  residence: {
    category: residence,
    categoryLayout: {
      right: '2.5rem',
      bottom: '0.9rem',
      width: '11.5rem',
      height: '6.2rem',
    },
  },
};
