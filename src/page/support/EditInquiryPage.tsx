import { useLoaderData } from 'react-router-dom';

import { INQUIRY_PLACEHOLDERS } from '@/feature/support/constant';
import { INQUIRY_OPTIONS } from '@/feature/support/data';
import type { InquiryDTO } from '@/feature/support/types';
import { SupportFormView } from '@/feature/support/ui';

export default function EditInquiryPage() {
  const post = useLoaderData() as InquiryDTO;

  const { dropdown, title, content } = INQUIRY_PLACEHOLDERS;

  return (
    <SupportFormView
      post={post}
      initialOption={INQUIRY_OPTIONS.find(
        (option) => option.key === post.category
      )}
      initialLink={post.link}
      submit={() => alert('submit!')}
      options={INQUIRY_OPTIONS}
      contentLabel={'문의 내용'}
      placeholders={{ dropdown, title, content }}
      showLinkField
    />
  );
}
