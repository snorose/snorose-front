const PAGE_SIZE = 10;

interface Post {
  postId: string | number;
}

interface PaginationPage<T> {
  hasNext: boolean;
  data: T[];
}

interface PaginationCache<T> {
  pages: PaginationPage<T>[];
  pageParams: number[];
}

export const deduplicatePaginatedData = <T extends Post>(array: T[]): T[] => {
  const seen = new Set<string | number>();
  const uniquePages = array.filter(({ postId }) => {
    const duplicate = seen.has(postId);
    seen.add(postId);
    return !duplicate;
  });
  return uniquePages;
};

export const flatPaginationCache = <T>(
  data: PaginationCache<T> | null | undefined
): T[] => {
  return data && !data.pages.includes(undefined as any)
    ? data.pages.flatMap((page) => page.data)
    : [];
};

export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
};

export const toPaginationCacheFormat = <T>(
  flattenPaginationCache: T[]
): PaginationCache<T> => {
  const pageChunk = chunkArray(flattenPaginationCache, PAGE_SIZE);
  const lastPageParam = pageChunk.length - 1;

  const newPages = pageChunk.map((page, index) => ({
    hasNext: index === lastPageParam ? false : true,
    data: page,
  }));

  const newPageParams = Array.from({ length: lastPageParam + 1 }, (_, i) => i);

  return {
    pages: newPages,
    pageParams: newPageParams,
  };
};
