import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { BOARD_ID, QUERY_KEYS, TOAST } from '@/shared/constant';
import { useToast } from '@/shared/hook';

import { createReport } from '@/feature/support/api';

import { createThumbnail } from '@/apis';

export default function useReportCreate() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { toast } = useToast();

  return useMutation({
    mutationFn: createReport,
    onSuccess: (data) => {
      const { reportId } = data;

      createThumbnail(BOARD_ID.inquiryAndReport, reportId) //
        .catch((error) => {
          /**
           * TODO: 썸네일 생성 실패는 치명적이지 않으므로, 에러를 사용자에게 알리지 않고 조용히 실패 처리합니다.
           * 에러 로그 수집 (모니터링: sentry)
           */
        });

      queryClient.removeQueries({
        queryKey: QUERY_KEYS.myActivity.list('inquiryReport'),
      });

      toast.success(TOAST.REPORT.create, {
        label: '신고 확인',
        action: () => navigate(`/report/${reportId}`),
      });

      navigate(-1);
    },

    onError: (error) => {
      if (!axios.isAxiosError(error) || !error.response) {
        toast.error('요청 처리 중 오류가 발생했어요');
        return;
      }

      const { code } = error.response.data;

      if (code === 2007) {
        toast.error('정회원 등업이 필요해요');
        navigate(-1);
        return;
      }

      if (code === 3032) {
        toast.error('첨부 파일은 최대 3개까지 업로드할 수 있어요');
        return;
      }

      if (code === 6103) {
        toast.error('신고 대상이 존재하지 않아요');
        return;
      }

      if (code === 6104) {
        toast.error('동일한 대상에 대한 신고가 아직 처리중이에요');
        return;
      }

      toast.error('잠시 후 다시 시도해주세요');
    },
  });
}
