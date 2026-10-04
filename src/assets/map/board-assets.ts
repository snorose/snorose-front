import {
  IllustrationBooksCap,
  IllustrationBookshelf,
  IllustrationBoxStarsCircle,
  IllustrationBoxStarsOpen,
  IllustrationDumbbellTowel,
  IllustrationFolderSearch,
  IllustrationFrameRope,
  IllustrationGlobe,
  IllustrationHeartPill,
  IllustrationIceCupBowl,
  IllustrationMicrophone,
  IllustrationPawBone,
  IllustrationPhoneBooks,
  IllustrationPotPaper,
  IllustrationResidence,
  IllustrationSnowfall,
  IllustrationSnowfallCircle,
  IllustrationSnowGround,
  IllustrationSnowGroundCircle,
  IllustrationSnowMountain,
  IllustrationSnowMountainCircle,
  IllustrationSpeakerNotes,
  IllustrationStage,
  IllustrationStarHonorBoard,
  IllustrationSuitcase,
  IllustrationTv,
} from '@snorose/icons';
import type { ComponentType, SVGProps } from 'react';

import type { BoardKey } from '@/types';

type BoardImage = ComponentType<SVGProps<SVGSVGElement>>;

export interface BoardImageLayout {
  right: string;
  bottom: string;
  width: string;
  height: string;
  overflow?: string;
}

interface BoardImages {
  category: BoardImage; // 게시판 카테고리 이미지
  categoryLayout: BoardImageLayout;
  categoryViewBox?: string;
  main?: BoardImage; // 메인 화면용
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
      right: '-0.3rem',
      bottom: '-0.2rem',
      width: '22.2rem',
      height: '10.6rem',
    },
    main: IllustrationSnowGroundCircle,
  },
  'permanent-snow': {
    category: IllustrationSnowMountain,
    categoryLayout: {
      right: '-0.1rem',
      bottom: '-1rem',
      width: '22.3rem',
      height: '12rem',
    },
    main: IllustrationSnowMountainCircle,
  },
  besookt: {
    category: IllustrationStarHonorBoard,
    categoryLayout: {
      right: '3.1rem',
      bottom: '-0.2rem',
      width: '8.6rem',
      height: '7.2rem',
    },
  },
  'student-council': {
    category: IllustrationMicrophone,
    categoryLayout: {
      right: '2.3rem',
      bottom: '-0.2rem',
      width: '10.3rem',
      height: '8.4rem',
    },
  },
  'graduation-preparation': {
    category: IllustrationBooksCap,
    categoryLayout: {
      right: '0.5rem',
      bottom: '0.4rem',
      width: '14.2rem',
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
    categoryViewBox: '0 0 141 111',
    categoryLayout: {
      right: '0.3rem',
      bottom: '0.15rem',
      width: '14rem',
      height: '12rem',
      overflow: 'visible',
    },
    main: IllustrationBoxStarsCircle,
  },
  sookplace: {
    category: IllustrationIceCupBowl,
    categoryLayout: {
      right: '3.1rem',
      bottom: '1.2rem',
      width: '8.7rem',
      height: '7.2rem',
    },
  },
  residence: {
    category: IllustrationResidence,
    categoryLayout: {
      right: '2.5rem',
      bottom: '1rem',
      width: '11.5rem',
      height: '6.1rem',
    },
  },
  'video-content': {
    category: IllustrationTv,
    categoryLayout: {
      right: '2.5rem',
      bottom: '1rem',
      width: '8.6rem',
      height: '6.1rem',
    },
  },
  'anime-comics': {
    category: IllustrationPhoneBooks,
    categoryLayout: {
      right: '2.5rem',
      bottom: '1rem',
      width: '10.6rem',
      height: '6.5rem',
    },
  },
  book: {
    category: IllustrationBookshelf,
    categoryLayout: {
      right: '2.5rem',
      bottom: '1rem',
      width: '9.9rem',
      height: '6.2rem',
    },
  },
  music: {
    category: IllustrationSpeakerNotes,
    categoryLayout: {
      right: '2.5rem',
      bottom: '1rem',
      width: '10.1rem',
      height: '7.5rem',
    },
  },
  performance: {
    category: IllustrationStage,
    categoryLayout: {
      right: '2.5rem',
      bottom: '1rem',
      width: '8.8rem',
      height: '6.5rem',
    },
  },
  exhibition: {
    category: IllustrationFrameRope,
    categoryLayout: {
      right: '2.5rem',
      bottom: '1rem',
      width: '9.2rem',
      height: '7rem',
    },
  },
  health: {
    category: IllustrationHeartPill,
    categoryLayout: {
      right: '2.5rem',
      bottom: '1rem',
      width: '8.7rem',
      height: '6.1rem',
    },
  },
  pet: {
    category: IllustrationPawBone,
    categoryLayout: {
      right: '2.5rem',
      bottom: '1rem',
      width: '8rem',
      height: '6.6rem',
    },
  },
  trip: {
    category: IllustrationSuitcase,
    categoryLayout: {
      right: '2.5rem',
      bottom: '0.5rem',
      width: '6.3rem',
      height: '8.3rem',
    },
  },
  cooking: {
    category: IllustrationPotPaper,
    categoryLayout: {
      right: '2.5rem',
      bottom: '1rem',
      width: '10.1rem',
      height: '7.5rem',
    },
  },
  sport: {
    category: IllustrationDumbbellTowel,
    categoryLayout: {
      right: '2.5rem',
      bottom: '1rem',
      width: '9.6rem',
      height: '5.5rem',
    },
  },
  studyabroad: {
    category: IllustrationGlobe,
    categoryLayout: {
      right: '2.5rem',
      bottom: '0.5rem',
      width: '7.5rem',
      height: '8.5rem',
    },
  },
};
