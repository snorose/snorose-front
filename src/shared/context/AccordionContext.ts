import { createContext, useContext } from 'react';

export type AccordionOpenMap = Record<string | number, boolean>;

export const AccordionContext = createContext<
  | {
      isOpenMap: AccordionOpenMap;
      setIsOpenMap: React.Dispatch<React.SetStateAction<AccordionOpenMap>>;
    }
  | undefined
>(undefined);

export const AccordionItemContext = createContext<string | number | undefined>(
  undefined
);

export function useAccordion() {
  return useContext(AccordionContext);
}

export function useAccordionItemId() {
  const id = useContext(AccordionItemContext);

  if (id === undefined) {
    throw new Error('Accordion.Item 내부에서 사용해야 합니다.');
  }

  return id;
}
