import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BOARD_ID, QUERY_KEYS, TOAST } from '@/shared/constant';
import { useToast } from '@/shared/hook';

import { createInquiry } from '@/feature/support/api';

import { createThumbnail } from '@/apis';

export default function useInquiryCreate() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { toast } = useToast();

  return useMutation({
    mutationFn: createInquiry,
    onSuccess: (data) => {
      const { inquiryId } = data;

      createThumbnail(BOARD_ID.inquiryAndReport, inquiryId) //
        .catch((error) => {
          /**
           * TODO: 썸네일 생성 실패는 치명적이지 않으므로, 에러를 사용자에게 알리지 않고 조용히 실패 처리합니다.
           * 에러 로그 수집 (모니터링: sentry)
           */
        });

      toast.success(TOAST.INQUIRY.create);

      queryClient.removeQueries({
        queryKey: QUERY_KEYS.myActivity.list('inquiryReport'),
      });

      navigate(`/inquiry/${inquiryId}`, { replace: true });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
}
