import { useSearchParams } from 'react-router-dom';

export default function useCategorySearchParam(defaultValue: string) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') ?? defaultValue;

  const setCategory = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('category', value);

      return next;
    });
  };

  return { currentCategory, setCategory };
}
