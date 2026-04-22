import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

import { BOARD_ID } from '@/shared/constant';
import { useToast } from '@/shared/hook';

import { mapFileToAttachment } from '@/feature/attachment/lib';
import { createInquiry } from '@/feature/support/api';
import { INQUIRY_PLACEHOLDERS } from '@/feature/support/constant';
import { INQUIRY_OPTIONS } from '@/feature/support/data';
import { SupportFormView } from '@/feature/support/ui';

import { createThumbnail } from '@/apis';

export default function WriteInquiryPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { mutate: submitInquiry } = useMutation({
    mutationFn: createInquiry,
    onSuccess: (data) => {
      const { postId } = data;

      navigate(`/inquiry/${postId}`, { replace: true });

      createThumbnail(BOARD_ID.inquiryAndReport, postId) //
        .catch((error) => {
          /**
           * TODO: 썸네일 생성 실패는 치명적이지 않으므로, 에러를 사용자에게 알리지 않고 조용히 실패 처리합니다.
           * 에러 로그 수집 (모니터링: sentry)
           */
        });
    },
    onError: (error) => {
      toast({ message: error.message, variant: 'error' });
    },
  });

  const { dropdown, title, content } = INQUIRY_PLACEHOLDERS;

  return (
    <SupportFormView
      submit={({ title, content, selectedOption, url, files }) =>
        submitInquiry({
          title,
          content,
          inquiryCategory: selectedOption.key,
          target: url,
          attachments: files.map(mapFileToAttachment),
        })
      }
      options={INQUIRY_OPTIONS}
      contentLabel={'문의 내용'}
      placeholders={{ dropdown, title, content }}
      showLinkFiled
    />
  );
}
