import {
  useState,
  useContext,
  createContext,
  useRef,
  useEffect,
  ReactNode,
} from 'react';

import { Icon } from '@/shared/component';

import styles from './DropdownBlue.module.css';

interface DropdownBlueContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

interface DropdownBlueProps {
  children: ReactNode;
}

interface ItemProps {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

const DropdownBlueContext = createContext<DropdownBlueContextType | undefined>(
  undefined
);

const useDropdownBlueContext = () => {
  const context = useContext(DropdownBlueContext);
  if (!context) {
    throw new Error('Dropdown sub-components must be used within a Dropdown');
  }
  return context;
};

export const DropdownBlue = ({ children }: DropdownBlueProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
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
    <DropdownBlueContext.Provider value={{ isOpen, toggle, close }}>
      <div ref={dropdownRef} className={styles.container}>
        {children}
      </div>
    </DropdownBlueContext.Provider>
  );
};

const Trigger = ({ children }: DropdownBlueProps) => {
  const { toggle } = useDropdownBlueContext();

  return (
    <div className={styles.trigger} onClick={toggle}>
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

const Menu = ({ children }: DropdownBlueProps) => {
  const { isOpen } = useDropdownBlueContext();

  if (!isOpen) return null;

  return (
    <div className={styles.menu}>
      <ul className={styles.list}>{children}</ul>
    </div>
  );
};

const Item = ({ children, selected = false, onClick }: ItemProps) => {
  const { close } = useDropdownBlueContext();

  const handleClick = () => {
    onClick?.();
    close();
  };

  return (
    <li
      className={`${styles.item} ${selected && styles.selected}`}
      onClick={handleClick}
    >
      {children}
      {selected && <Icon id='check' width={14} height={11} />}
    </li>
  );
};

DropdownBlue.Trigger = Trigger;
DropdownBlue.Menu = Menu;
DropdownBlue.Item = Item;
