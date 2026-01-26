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
  triggerRef: React.RefObject<HTMLDivElement>;
  itemRefs: React.RefObject<Map<string, HTMLDivElement>>;
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

export const DropdownBlue = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const triggerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());

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
    <AccessibilityContext.Provider
      value={{ menuId, triggerId, triggerRef, itemRefs }}
    >
      <DropdownBlueContext.Provider value={{ isOpen, toggle, close }}>
        <div ref={dropdownRef} className={`${styles.container} ${className}`}>
          {children}
        </div>
      </DropdownBlueContext.Provider>
    </AccessibilityContext.Provider>
  );
};

const Trigger = ({ children }: { children: ReactNode }) => {
  const { triggerRef, triggerId, menuId } = useAccessibilityContext();
  const { isOpen, toggle } = useDropdownBlueContext();

  return (
    <div
      ref={triggerRef}
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
        />
        <p>{children}</p>
      </div>

      <Icon className={styles.angle} id='angle-down' width={24} height={24} />
    </div>
  );
};

const Menu = ({ children }: { children: ReactNode }) => {
  const { itemRefs, triggerRef, triggerId, menuId } = useAccessibilityContext();
  const { isOpen, close } = useDropdownBlueContext();

  useEffect(() => {
    if (isOpen && itemRefs.current) {
      const items = Array.from(itemRefs.current.values());
      const selectedItem = items.find(
        (el) => el.getAttribute('aria-selected') === 'true'
      );

      const fucusTargetItem = selectedItem || items[0];
      fucusTargetItem.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleKeyEvent = (e: React.KeyboardEvent) => {
    const map = itemRefs.current;
    if (!map) return;

    const items = Array.from(map.values());
    const index = items.indexOf(e.target as HTMLDivElement);

    switch (e.key) {
      case 'ArrowUp': {
        const prevIndex = index > 0 ? index - 1 : 0;
        items[prevIndex].focus();
        break;
      }
      case 'ArrowDown': {
        const nextIndex =
          index < items.length - 1 ? index + 1 : items.length - 1;
        items[nextIndex].focus();
        break;
      }
      case 'Enter': {
        items[index].click();
        triggerRef.current?.focus();
        break;
      }
      case 'Escape': {
        close();
        triggerRef.current?.focus();
        break;
      }
    }
  };

  return (
    <div
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
  id,
  selected = false,
  onClick,
}: {
  children: ReactNode;
  id: string;
  selected?: boolean;
  onClick?: () => void;
}) => {
  const { itemRefs } = useAccessibilityContext();
  const { close } = useDropdownBlueContext();

  const handleClick = () => {
    onClick?.();
    close();
  };

  return (
    <div
      ref={(el) => {
        if (el) {
          itemRefs.current.set(id, el);
        } else {
          itemRefs.current.delete(id);
        }
      }}
      className={`${styles.item} ${selected && styles.selected}`}
      onClick={handleClick}
      onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) =>
        e.currentTarget.focus()
      }
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
