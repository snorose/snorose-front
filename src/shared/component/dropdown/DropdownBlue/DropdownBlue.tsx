import {
  ReactNode,
  createContext,
  useContext,
  useRef,
  useEffect,
  useId,
  useState,
} from 'react';

import { Icon } from '@/shared/component';

import styles from './DropdownBlue.module.css';

interface AccessibilityContextType {
  triggerId: string;
  menuId: string;
}

interface DropdownBlueContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

const DropdownBlueContext = createContext<DropdownBlueContextType | undefined>(
  undefined
);

const useAccessibilityContext = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      'DropdownBlue sub-components must be used within a DropdownBlue'
    );
  }
  return context;
};

const useDropdownBlueContext = () => {
  const context = useContext(DropdownBlueContext);
  if (!context) {
    throw new Error(
      'DropdownBlue sub-components must be used within a DropdownBlue'
    );
  }
  return context;
};

export const DropdownBlue = ({ children }: { children: ReactNode }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuId = useId();
  const triggerId = useId();

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <AccessibilityContext.Provider value={{ menuId, triggerId }}>
      <DropdownBlueContext.Provider value={{ isOpen, toggle, close }}>
        <div ref={dropdownRef} className={styles.container}>
          {children}
        </div>
      </DropdownBlueContext.Provider>
    </AccessibilityContext.Provider>
  );
};

const Trigger = ({ children }: { children: ReactNode }) => {
  const { triggerId, menuId } = useAccessibilityContext();
  const { isOpen, toggle } = useDropdownBlueContext();

  return (
    <div
      className={styles.trigger}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          toggle();
        }
      }}
      id={triggerId}
      role='button'
      tabIndex={0}
      aria-haspopup='listbox'
      aria-expanded={isOpen}
      aria-controls={menuId}
    >
      <div>
        <Icon
          className={styles.icon}
          id='clip-board-list'
          width={21}
          height={22}
          fill='white'
        />
        <p>{children}</p>
      </div>

      <Icon className={styles.angle} id='angle-down' width={24} height={24} />
    </div>
  );
};

const Menu = ({ children }: { children: ReactNode }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const { triggerId, menuId } = useAccessibilityContext();
  const { isOpen, close } = useDropdownBlueContext();

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstOption =
        menuRef.current.querySelector<HTMLElement>('[role="option"]');
      firstOption?.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleKeyEvent = (e: React.KeyboardEvent) => {
    if (!menuRef.current) return;

    const options =
      menuRef.current.querySelectorAll<HTMLElement>('[role="option"]');

    const index = Array.from(options).indexOf(
      document.activeElement as HTMLElement
    );

    switch (e.key) {
      case 'ArrowUp': {
        const nextIndex = index > 0 ? index - 1 : 0;
        options[nextIndex].focus();
        break;
      }
      case 'ArrowDown': {
        const nextIndex =
          index < options.length - 1 ? index + 1 : options.length - 1;
        options[nextIndex].focus();
        break;
      }
      case 'Enter':
        (document.activeElement as HTMLElement).click();
        break;
      case 'Escape':
        close();
        break;
    }
  };

  return (
    <div
      ref={menuRef}
      className={styles.menu}
      onKeyDown={handleKeyEvent}
      id={menuId}
      role='listbox'
      aria-labelledby={triggerId}
    >
      {children}
    </div>
  );
};

const Item = ({
  children,
  selected = false,
  onClick,
}: {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}) => {
  const { close } = useDropdownBlueContext();

  const handleClick = () => {
    onClick?.();
    close();
  };

  return (
    <div
      className={`${styles.item} ${selected && styles.selected}`}
      onClick={handleClick}
      onKeyDown={() => {}}
      role='option'
      aria-selected={selected}
      tabIndex={-1}
    >
      {children}
      {selected && <Icon id='check' width={14} height={11} />}
    </div>
  );
};

DropdownBlue.Trigger = Trigger;
DropdownBlue.Menu = Menu;
DropdownBlue.Item = Item;
