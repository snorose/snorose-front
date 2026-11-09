import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS, TOAST } from '@/shared/constant';
import { useToast } from '@/shared/hook';

import { deleteInquiry } from '@/feature/support/api';

export default function useInquiryDelete() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteInquiry,
    onSuccess: (data) => {
      const { inquiryId } = data;

      queryClient.removeQueries({
        queryKey: QUERY_KEYS.inquiry.byId(inquiryId),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.myActivity.list('inquiryReport'),
      });

      toast.success(TOAST.INQUIRY.delete);

      navigate(-1);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
