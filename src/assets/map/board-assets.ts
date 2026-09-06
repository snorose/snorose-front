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
  top: string;
  right: string;
  bottom?: string;
  width?: string;
  height?: string;
}

interface BoardImages {
  category: BoardImage | string; // 게시판 카테고리 이미지
  categoryLayout: BoardImageLayout;
  main?: BoardImage | string; // 메인 화면용
}

export const BOARD_IMAGES: Partial<Record<BoardKey, BoardImages>> = {
  'first-snow': {
    category: IllustrationSnowfall,
    categoryLayout: { top: '0rem', right: '0.6rem' },
    main: IllustrationSnowfallCircle,
  },
  'large-snow': {
    category: IllustrationSnowGround,
    categoryLayout: { top: '0rem', right: '0rem' },
    main: IllustrationSnowGroundCircle,
  },
  'permanent-snow': {
    category: IllustrationSnowMountain,
    categoryLayout: { top: '0rem', right: '0rem' },
    main: IllustrationSnowMountainCircle,
  },
  besookt: {
    category: IllustrationStarHonorBoard,
    categoryLayout: { top: '2.6rem', right: '2.7rem' },
  },
  'student-council': {
    category: IllustrationMicrophone,
    categoryLayout: { top: '1.6rem', right: '1.9rem' },
  },
  'graduation-preparation': {
    category: IllustrationBooksCap,
    categoryLayout: { top: '1.5rem', right: '0.4rem' },
  },
  'finance-audit': {
    category: IllustrationFolderSearch,
    categoryLayout: { top: '2.9rem', right: '1.2rem' },
  },
  event: {
    category: IllustrationBoxStarsOpen,
    categoryLayout: {
      top: '-1.8rem',
      right: '0.2rem',
      width: '14.1rem',
      height: '14.1rem',
    },
    main: IllustrationBoxStarsCircle,
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
