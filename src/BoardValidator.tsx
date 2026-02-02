import { ReactNode } from 'react';
import { useMatches, useParams } from 'react-router-dom';

import { UNSUPPORTED_BOARD_SECTIONS } from '@/shared/constant';

import { NotFoundPage } from '@/page/etc';

interface RouteHandle {
  feature?: string;
}

const BOARD_NAMES = [
  'first-snow',
  'large-snow',
  'permanent-snow',

  'besookt',

  'student-council',
  'graduation-preparation',
  'finance-audit',

  'exam-review',

  'event',
  'support',
];

export default function BoardValidator({ children }: { children: ReactNode }) {
  const { boardName } = useParams();
  const matches = useMatches();

  const isValidBoard = BOARD_NAMES.includes(boardName);
  if (!isValidBoard) {
    return <NotFoundPage />;
  }

  const currentFeature = matches
    .map((m) => (m.handle as RouteHandle)?.feature)
    .filter(Boolean)
    .at(-1);

  const notFound =
    UNSUPPORTED_BOARD_SECTIONS[boardName].includes(currentFeature);
  if (notFound) {
    return <NotFoundPage />;
  }

  return children;
}
