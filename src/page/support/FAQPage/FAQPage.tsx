import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSearchParams } from 'react-router-dom';

import { QueryErrorResetBoundary } from '@tanstack/react-query';

import {
  Accordion,
  BackAppBar,
  CategoryTab,
  FetchLoading,
  ServerErrorFallback,
} from '@/shared/component';

import { getCommerceErrorCode } from '@/feature/commerce/utils/commerceRules';
import useFAQ from '@/feature/support/hook/useFAQ';

import styles from './FAQPage.module.css';

const CATEGORY_ITEMS = [
  '전체',
  '가입 · 인증',
  '시험후기',
  '포인트',
  '게시판 · 커뮤니티',
  '기능 이용',
  '스노로즈 운영',
];

export default function FAQPage() {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') ?? '전체';

  return (
    <div>
      <BackAppBar title='자주 묻는 질문' notFixed />

      <CategoryTab defaultCategory='전체'>
        {CATEGORY_ITEMS.map((item) => (
          <CategoryTab.Item key={item} category={item}>
            {item}
          </CategoryTab.Item>
        ))}
      </CategoryTab>

      <Notice />

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            resetKeys={[currentCategory]}
            FallbackComponent={ErrorFallback}
          >
            <Suspense fallback={<FetchLoading />}>
              <FAQs currentCategory={currentCategory} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

function FAQs({ currentCategory }: { currentCategory: string }) {
  const { data: faqList } = useFAQ(currentCategory);

  return (
    <Accordion className={styles.notice} headingLevel={2}>
      {faqList.map((faq) => (
        <Accordion.Item key={faq.faqId}>
          <Accordion.Header>{faq.question}</Accordion.Header>
          <Accordion.Content>{faq.answer}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

function Notice() {
  return (
    <div className={styles.noticeContainer}>
      {`자주 묻는 질문을 확인해 보세요.\n궁금하신 점이 해결되지 않았다면, 아래 공식 창구로 문의해 주세요.`}
      <div>
        <p>[공식 문의 창구]</p>
        <p>- 이메일: snorose1906@gmail.com</p>
        <p>
          - 카카오톡: 1:1 문의{' ('}
          <a
            className={styles.link}
            href='https://pf.kakao.com/_Xmhxhn'
            target='_blank'
            rel='noreferrer noopener'
          >
            <span className={styles.linkText}>링크</span>
          </a>
          {')'}
        </p>
        <p>
          - 스노로즈 안내서{' ('}
          <a
            className={styles.link}
            href='https://www.notion.so/snorose/1957ef0aa3bf80a68ce3fe67f7a7e230'
            target='_blank'
            rel='noreferrer noopener'
          >
            <span className={styles.linkText}>링크</span>
          </a>
          {')'}
        </p>
        <p>
          - 문의하기{' ('}
          <a
            className={styles.link}
            href='/inquiry/write'
            rel='noreferrer noopener'
          >
            <span className={styles.linkText}>링크</span>
          </a>
          {')'}
        </p>
      </div>
    </div>
  );
}

function ErrorFallback({ error, resetErrorBoundary }) {
  const errorCode = getCommerceErrorCode(error);

  switch (errorCode) {
    default:
      return <ServerErrorFallback reset={resetErrorBoundary} />;
  }
}
