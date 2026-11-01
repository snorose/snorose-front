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

function Item({
  category,
  children,
}: {
  category: string;
  children: React.ReactNode;
}) {
  const { currentCategory, setSearchParams } = useCategoryTab();

  const selectedStyle = currentCategory === category ? 'selected' : '';

  const handleClick = (category: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('category', category);
      return next;
    });
  };

  return (
    <div
      className={`${styles.item} ${styles[selectedStyle]}`}
      onClick={() => handleClick(category)}
    >
      {children}
    </div>
  );
}

CategoryTab.Item = Item;
