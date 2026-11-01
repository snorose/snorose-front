import { type ComponentPropsWithoutRef, useState } from 'react';

import { IconChevronDown } from '@snorose/icons';

import {
  AccordionContext,
  AccordionItemContext,
  type AccordionOpenMap,
  useAccordion,
  useAccordionItemId,
} from '@/shared/context/AccordionContext';

import styles from './Accordion.module.css';

type AccordionProps = ComponentPropsWithoutRef<'div'> & {
  children: React.ReactNode;
};

export default function Accordion({
  children,
  className,
  ...props
}: AccordionProps) {
  const [isOpenMap, setIsOpenMap] = useState<AccordionOpenMap>({});

  return (
    <AccordionContext.Provider value={{ isOpenMap, setIsOpenMap }}>
      <div
        {...props}
        className={[styles.accordion, className].filter(Boolean).join(' ')}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({
  id,
  children,
}: {
  id: string | number;
  children: React.ReactNode;
}) {
  return (
    <AccordionItemContext.Provider value={id}>
      {children}
    </AccordionItemContext.Provider>
  );
}

function AccordionTrigger({ children }: { children: React.ReactNode }) {
  const { isOpenMap, setIsOpenMap } = useAccordion();
  const id = useAccordionItemId();

  const isOpen = isOpenMap[id] ? `opened` : ``;

  const handleClick = () => {
    setIsOpenMap((prev) => {
      const next = Object.fromEntries(
        Object.keys(prev).map((key) => [key, false])
      );
      return { ...next, [id]: !prev[id] };
    });
  };

  return (
    <div
      className={`${styles.trigger} ${styles[isOpen]}`}
      onClick={handleClick}
    >
      <span>{children}</span>
      <IconChevronDown className={styles.toggleIcon} color='var(--blue-4)' />
    </div>
  );
}

function AccordionContent({ children }: { children: React.ReactNode }) {
  const { isOpenMap } = useAccordion();
  const id = useAccordionItemId();

  const isOpen = isOpenMap[id] ? `opened` : ``;

  return (
    <div className={`${styles.content} ${styles[isOpen]}`}>{children}</div>
  );
}

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;
