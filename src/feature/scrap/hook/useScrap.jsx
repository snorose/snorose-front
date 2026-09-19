import { useParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MUTATION_KEY, QUERY_KEY } from '@/shared/constant';
import { useToast } from '@/shared/hook';

import { scrap as scrapApi, unscrap as unscrapApi } from '@/apis';

export default function useScrap() {
  const { toast } = useToast();
  const { postId } = useParams();

  const queryClient = useQueryClient();

  const updateScrapCache = ({ isScrapped, scrapCount }) => {
    queryClient.setQueryData(QUERY_KEY.post(postId), (prev) => ({
      ...prev,
      isScrapped,
      scrapCount,
    }));
  };

  const onSuccess = ({ isScrapped, scrapCount }) => {
    updateScrapCache({
      isScrapped,
      scrapCount,
    });
  };

  const onError = ({ response }) => {
    toast({ message: response.data.message, variant: 'error' });
  };

  const scrap = useMutation({
    mutationKey: [MUTATION_KEY.scrap],
    mutationFn: () => scrapApi({ postId }),
    onSuccess,
    onError,
  });

  const unscrap = useMutation({
    mutationKey: [MUTATION_KEY.unscrap],
    mutationFn: () => unscrapApi({ postId }),
    onSuccess,
    onError,
  });

  return { scrap, unscrap };
}
