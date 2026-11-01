import { createContext, useContext } from 'react';

export type AccordionOpenMap = Record<string | number, boolean>;

export const AccordionContext = createContext<{
  isOpenMap: AccordionOpenMap;
  setIsOpenMap: React.Dispatch<React.SetStateAction<AccordionOpenMap>>;
} | null>(null);

export function useAccordion() {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error('Accordion 내부에서 사용해야 합니다.');
  }

  return useContext(AccordionContext);
}

export const AccordionItemContext = createContext<string | number | null>(null);

export function useAccordionItemId() {
  const context = useContext(AccordionItemContext);

  if (!context) {
    throw new Error('Accordion.Item 내부에서 사용해야 합니다.');
  }

  return context;
}
