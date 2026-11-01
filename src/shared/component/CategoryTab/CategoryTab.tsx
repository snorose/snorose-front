import { ComponentPropsWithoutRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  CategoryTabContext,
  useCategoryTab,
} from '@/shared/context/CategoryTabContext';

import styles from './CategoryTab.module.css';

export default function CategoryTab({
  defaultCategory,
  children,
}: {
  defaultCategory: string;
  children: React.ReactNode;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') ?? defaultCategory;

  return (
    <CategoryTabContext.Provider value={{ currentCategory, setSearchParams }}>
      <div className={styles.tabList}>{children}</div>
    </CategoryTabContext.Provider>
  );
}

type CategoryTabItemProps = ComponentPropsWithoutRef<'button'> & {
  children: React.ReactNode;
  category: string;
};

function Item({ category, children, ...props }: CategoryTabItemProps) {
  const { currentCategory, setSearchParams } = useCategoryTab();

  const isSelected = currentCategory === category;

  const handleClick = (category: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('category', category);
      return next;
    });
  };

  return (
    <button
      {...props}
      className={`${styles.item} ${isSelected ? styles.selected : ''}`}
      onClick={() => handleClick(category)}
      aria-pressed={isSelected}
    >
      {children}
    </button>
  );
}

CategoryTab.Item = Item;
