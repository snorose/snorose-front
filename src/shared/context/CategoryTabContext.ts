import { createContext, useContext } from 'react';

export const CategoryTabContext = createContext<{
  currentCategory: string;
  onValueChange: (category: string) => void;
} | null>(null);

export function useCategoryTab() {
  const context = useContext(CategoryTabContext);

  if (!context) {
    throw new Error('CategoryTab 내부에서 사용해야 합니다.');
  }

  return useContext(CategoryTabContext);
}
