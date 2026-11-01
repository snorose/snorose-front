import {
  type ComponentPropsWithoutRef,
  ElementType,
  useId,
  useState,
} from 'react';

import { IconChevronDown } from '@snorose/icons';

import {
  AccordionContext,
  AccordionIdsContext,
  useAccordion,
  useAccordionIds,
} from '@/shared/context/AccordionContext';

import styles from './Accordion.module.css';

type AccordionProps = ComponentPropsWithoutRef<'div'> & {
  children: React.ReactNode;
  headingLevel: 1 | 2 | 3 | 4 | 5 | 6;
};

export default function Accordion({
  headingLevel = 3,
  className,
  children,
  ...props
}: AccordionProps) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  return (
    <AccordionContext.Provider value={{ openMap, setOpenMap, headingLevel }}>
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
  const id = useId();

  return (
    <AccordionIdsContext.Provider value={id}>
      {children}
    </AccordionIdsContext.Provider>
  );
}

function AccordionHeader({ children }: { children: React.ReactNode }) {
  const id = useAccordionIds();
  const { openMap, setOpenMap, headingLevel } = useAccordion();

  const isOpen = Boolean(openMap[id]);

  const handleClick = () => {
    setOpenMap((prev) => {
      const next = Object.fromEntries(
        Object.keys(prev).map((key) => [key, false])
      );
      return { ...next, [id]: !prev[id] };
    });
  };

  const Heading = `h${headingLevel}` as ElementType;

  return (
    <Heading>
      <button
        type='button'
        id={`${id}-header`}
        aria-controls={`${id}-content`}
        aria-expanded={isOpen}
        className={`${styles.trigger} ${isOpen ? styles.opened : ''}`}
        onClick={handleClick}
      >
        <span>{children}</span>
        <IconChevronDown className={styles.toggleIcon} color='var(--blue-4)' />
      </button>
    </Heading>
  );
}

function AccordionContent({ children }: { children: React.ReactNode }) {
  const id = useAccordionIds();
  const { openMap } = useAccordion();

  const isOpen = Boolean(openMap[id]);

  return (
    <div
      ref={(element) => {
        element?.toggleAttribute('inert', !isOpen);
      }}
      id={`${id}-content`}
      aria-labelledby={`${id}-header`}
      role='region'
      className={`${styles.content} ${isOpen ? styles.opened : ''}`}
    >
      {children}
    </div>
  );
}

Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;
