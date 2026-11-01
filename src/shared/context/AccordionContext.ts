import { createContext, useContext } from 'react';

export const AccordionContext = createContext<{
  openMap: Record<string, boolean>;
  setOpenMap: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  headingLevel: 1 | 2 | 3 | 4 | 5 | 6;
} | null>(null);

export function useAccordion() {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error('Accordion 내부에서 사용해야 합니다.');
  }

  return context;
}

export const AccordionIdsContext = createContext<string | null>(null);

export function useAccordionIds() {
  const context = useContext(AccordionIdsContext);

  if (!context) {
    throw new Error('Accordion.Item 내부에서 사용해야 합니다.');
  }

  return context;
}
