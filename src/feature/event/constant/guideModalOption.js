import { IllustrationCalendarEmpty } from '@snorose/icons';

import {
  noSellIllustration,
  noTransferIllustration,
} from '@/assets/illustrations';

export const EVENT_GUIDE_MODAL_OPTIONS = [
  {
    title: '무단 불참 절대 금지!',
    content: (
      <>
        무단 불참 시 경고 1회가 부여되며,
        <br />
        향후 모든 이벤트에 참여가 불가해요
      </>
    ),
    image: IllustrationCalendarEmpty,
    imageLabel: '무단 불참 금지를 안내하는 일러스트',
  },
  {
    title: '양도, 대리수령 절대 금지!',
    content: (
      <>
        양도,대리수령 적발 시 2년 강등되며,
        <br />
        향후 모든 이벤트에 참여가 불가해요
      </>
    ),
    image: noTransferIllustration,
    imageLabel: '양도와 대리수령 금지를 안내하는 일러스트',
  },
  {
    title: '입장권 금전 거래 절대 금지!',
    content: (
      <>
        입장권 금전 거래 적발 시,
        <br />
        영구 강등 처리돼요
      </>
    ),
    image: noSellIllustration,
    imageLabel: '입장권 금전 거래 금지를 안내하는 일러스트',
  },
];
