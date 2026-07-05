export type { BoardKey } from '@/shared/lib/board-registry';

export type UseMutationCallbacks = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSettled?: () => void;
};
