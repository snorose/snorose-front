import { type ComponentPropsWithoutRef, useId, useState } from 'react';

import { IconChevronDown } from '@snorose/icons';

import {
  AccordionContext,
  AccordionIdsContext,
  type AccordionOpenMap,
  useAccordion,
  useAccordionIds,
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

function AccordionItem({ children }: { children: React.ReactNode }) {
  const domId = useId();

  return (
    <AccordionIdsContext.Provider
      value={{
        accordionId: domId,
        triggerId: `${domId}-trigger`,
        contentId: `${domId}-content`,
      }}
    >
      {children}
    </AccordionIdsContext.Provider>
  );
}

function AccordionTrigger({ children }: { children: React.ReactNode }) {
  const { isOpenMap, setIsOpenMap } = useAccordion();
  const { accordionId, triggerId, contentId } = useAccordionIds();

  const isOpen = Boolean(isOpenMap[accordionId]);

  const handleClick = () => {
    setIsOpenMap((prev) => {
      const next = Object.fromEntries(
        Object.keys(prev).map((key) => [key, false])
      );
      return { ...next, [accordionId]: !prev[accordionId] };
    });
  };

  return (
    <button
      type='button'
      id={triggerId}
      className={`${styles.trigger} ${isOpen ? styles.opened : ''}`}
      onClick={handleClick}
      aria-expanded={isOpen}
      aria-controls={contentId}
    >
      <span>{children}</span>
      <IconChevronDown className={styles.toggleIcon} color='var(--blue-4)' />
    </button>
  );
}

function AccordionContent({ children }: { children: React.ReactNode }) {
  const { isOpenMap } = useAccordion();
  const { accordionId, triggerId, contentId } = useAccordionIds();

  const isOpen = Boolean(isOpenMap[accordionId]);

  return (
    <div
      ref={(element) => {
        element?.toggleAttribute('inert', !isOpen);
      }}
      id={contentId}
      aria-labelledby={triggerId}
      className={`${styles.content} ${isOpen ? styles.opened : ''}`}
    >
      {children}
    </div>
  );
}

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;
