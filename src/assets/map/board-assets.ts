import { IllustrationBooksCap,IllustrationBoxStarsCircle,IllustrationBoxStarsOpen, IllustrationFolderSearch, IllustrationSnowfall, IllustrationSnowfallCircle } from '@snorose/icons';
import type { ComponentType, SVGProps } from 'react';

import besookt from '@/assets/images/besookt-board-page.svg';
import largeSnow from '@/assets/images/largeSnow-board-page.svg';
import largeSnowMain from '@/assets/images/largeSnow-main.svg';
import permanentSnow from '@/assets/images/permanentSnow-board-page.svg';
import permanentSnowMain from '@/assets/images/permanentSnow-main.svg';
import sookPlace from '@/assets/images/sookPlace.svg';
import studentCouncil from '@/assets/images/studentCouncil-board-page.svg';

import type { BoardKey } from '@/types';
type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>;

interface BoardImages {
  category: string | SvgComponent;
  main?: string | SvgComponent;
}

export const BOARD_IMAGES: Partial<Record<BoardKey, BoardImages>> = {
  'first-snow': {
    category: IllustrationSnowfall,
    main: IllustrationSnowfallCircle,
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
