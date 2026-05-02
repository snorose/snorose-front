import { Link } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { AppBar, Icon, MenuIcon, WriteButton } from '@/shared/component';
import { QUERY_KEY, STALE_TIME } from '@/shared/constant';

import { Filter, FilterList } from '@/feature/exam/component';
import { EXAM_TYPES, SEMESTERS, YEARS } from '@/feature/exam/constant';
import {
  Search,
  SearchExamReviewListSuspense,
} from '@/feature/search/component';

import { getNoticeLine, getReviewWritePeriodActive } from '@/apis';

import styles from './ExamReviewListPage.module.css';

export default function ExamReviewListPage() {
  const { data: noticeLineData } = useQuery({
    queryKey: [QUERY_KEY.noticeLine, 32],
    queryFn: () => getNoticeLine(32),
    staleTime: STALE_TIME.noticeLine,
  });

  const { data: isReviewPeriodActive } = useQuery({
    queryKey: [QUERY_KEY.reviewWritePeriodActive],
    queryFn: getReviewWritePeriodActive,
  });

  return (
    <section className={styles.container}>
      <AppBar title='시험후기'>
        <MenuIcon />
      </AppBar>

      <Link className={styles.notificationBar} to={`/board/exam-review/notice`}>
        <Icon id='notice-bell' width={13} height={16} />
        <p>[필독]&nbsp;&nbsp;{noticeLineData?.title}</p>
      </Link>

      <Search className={styles.search} placeholder='시험후기 검색' />
      <FilterList>
        <Filter filterKey='lectureYear' options={YEARS} placeholder='연도' />
        <Filter filterKey='semester' options={SEMESTERS} placeholder='학기' />
        <Filter
          filterKey='examType'
          options={EXAM_TYPES}
          placeholder='시험 종류'
        />
      </FilterList>
      <SearchExamReviewListSuspense />

      {isReviewPeriodActive && <WriteButton to='/board/exam-review-write' />}
    </section>
  );
}
