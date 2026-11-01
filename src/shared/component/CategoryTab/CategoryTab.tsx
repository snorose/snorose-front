import { ComponentPropsWithoutRef } from 'react';

import {
  CategoryTabContext,
  useCategoryTab,
} from '@/shared/context/CategoryTabContext';

import styles from './CategoryTab.module.css';

export default function CategoryTab({
  currentCategory,
  onValueChange,
  label,
  children,
}: {
  currentCategory: string;
  onValueChange: (category: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const direction = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    }[event.key];

    if (direction === undefined) return;

    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        'button[role="radio"]:not(:disabled)'
      )
    );

    const currentIndex = items.findIndex((item) => item === event.target);
    if (currentIndex === -1) return;

    // 방향키로 페이지가 스크롤되는 것을 방지합니다.
    event.preventDefault();

    const nextIndex = (currentIndex + direction + items.length) % items.length;
    const nextItem = items[nextIndex];

    nextItem.focus();
  };

  return (
    <CategoryTabContext.Provider value={{ currentCategory, onValueChange }}>
      <div
        role='radiogroup'
        aria-label={label}
        onKeyDown={handleKeyDown}
        className={styles.tabList}
      >
        {children}
      </div>
    </CategoryTabContext.Provider>
  );
}

type CategoryTabItemProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'aria-pressed'
> & {
  category: string;
};

function Item({ category, children, ...props }: CategoryTabItemProps) {
  const { currentCategory, onValueChange } = useCategoryTab();

  const isSelected = currentCategory === category;

  const handleClick = () => {
    if (isSelected) return;
    onValueChange(category);
  };

  return (
    <button
      {...props}
      type='button'
      role='radio'
      aria-checked={isSelected}
      tabIndex={isSelected ? 0 : -1}
      onClick={handleClick}
      className={[styles.item, isSelected && styles.selected]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
}

CategoryTab.Item = Item;
