import { createContext, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

export const CategoryTabContext = createContext<{
  currentCategory: string;
  setSearchParams: ReturnType<typeof useSearchParams>[1];
} | null>(null);

export function useCategoryTab() {
  const context = useContext(CategoryTabContext);

  if (!context) {
    throw new Error('CategoryTab 내부에서 사용해야 합니다.');
  }

  return useContext(CategoryTabContext);
}
