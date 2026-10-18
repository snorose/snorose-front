import { useNavigate } from 'react-router';

import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/shared/hook';

import { withdrawReport } from '@/feature/support/api';

export default function useWithdrawReport() {
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation({
    mutationFn: withdrawReport,
    onSuccess: () => {
      toast.success('신고가 철회되었어요');
      navigate(-1);
    },
    onError: (error) => {},
  });
}
