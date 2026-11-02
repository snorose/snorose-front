import { useNavigate } from 'react-router';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { QUERY_KEY } from '@/shared/constant';
import { useToast } from '@/shared/hook';

import { withdrawReport } from '@/feature/support/api';

export default function useWithdrawReport() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: withdrawReport,
    onSuccess: (data) => {
      const { postId } = data;

      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.post(postId),
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.myInquiriesAndReports],
      });

      toast.success('신고가 철회되었어요');
      navigate(-1);
    },
    onError: (error) => {
      if (!axios.isAxiosError(error) || !error.response) {
        toast.error('요청 처리 중 오류가 발생했어요');
        return;
      }

      const { code } = error.response.data;

      switch (code) {
        case 6101:
          toast.error('존재하지 않는 신고예요');
          break;
        case 6105:
          toast.error('이미 철회되었거나 관리자 답변이 있어요');
          break;
        default:
          toast.error('잠시 후 다시 시도해주세요');
      }
    },
  });
}
