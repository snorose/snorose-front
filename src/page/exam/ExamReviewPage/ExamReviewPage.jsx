import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getReviewDetail } from '@/apis';

import {
  BackAppBar,
  FetchLoading,
  FetchLoadingOverlay,
  Icon,
} from '@/shared/component';
import { DateTime } from '@/shared/lib';
import { QUERY_KEY } from '@/shared/constant';

import { NotFoundPage } from '@/page/etc';

import { CommentInput, CommentListSuspense } from '@/feature/comment/component';
import {
  ExamReviewModalRenderer,
  ReviewContentItem,
  ReviewDownload,
} from '@/feature/exam/component';
import { convertToObject } from '@/feature/exam/lib';
import {
  LECTURE_TYPES,
  SEMESTERS,
  EXAM_TYPES,
  FLEX_ALIGN,
} from '@/feature/exam/constant';
import { useScrap } from '@/feature/scrap/hook';
import { useReportHandler } from '@/feature/report/hook/useReport';
import { useDeleteExamReviewHandler } from '@/feature/exam/hook/useDeleteExamReviewHandler';

import styles from './ExamReviewPage.module.css';
import { ModalContext } from '@/shared/context/ModalContext';
import { useModalReset } from '@/shared/hook/useBlocker';

import cloudLogo from '@/assets/images/cloudLogo.svg';
import { useCommentContext } from '@/feature/comment/context';

const COURSE_TYPE = convertToObject(LECTURE_TYPES);
const SEMESTER = convertToObject(SEMESTERS);
const EXAM_TYPE = convertToObject(EXAM_TYPES);

export default function ExamReviewPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { modal, setModal } = useContext(ModalContext);

  // 페이지 언마운트 시 모달 상태 초기화
  useModalReset();

  const { data, error, isError, isLoading } = useQuery({
    queryKey: QUERY_KEY.post(postId),
    queryFn: () => getReviewDetail(postId),
    staleTime: 1000 * 60 * 5,
  });

  const { handleReport } = useReportHandler(modal, setModal, data);
  const { handleDelete } = useDeleteExamReviewHandler();

  const handleEdit = () => {
    setModal({ id: null, type: null });
    navigate(`/board/exam-review/${postId}/edit`, {
      state: data,
    });
  };

  if (isLoading) {
    return (
      <>
        <BackAppBar notFixed />
        <FetchLoading>게시글 불러오는 중...</FetchLoading>
      </>
    );
  }

  if (error?.response.status === 404) {
    return <NotFoundPage />;
  }

  if (isError) {
    return (
      <>
        <BackAppBar notFixed />
        <FetchLoading animation={false}>
          게시글을 불러오지 못했습니다.
        </FetchLoading>
      </>
    );
  }

  const {
    commentCount,
    createdAt,
    examType,
    fileName,
    isConfirmed,
    isDownloaded,
    isEdited,
    isOnline,
    isPF,
    isScrapped,
    isWriter,
    lectureName,
    lectureType,
    lectureYear,
    professor,
    questionDetail,
    scrapCount,
    semester,
    title,
    userDisplay,
  } = data ?? {};

  return (
    <section className={styles.container}>
      <BackAppBar backgroundColor={'#eaf5fd'} />

      <div className={styles.blueContainer}>
        <div className={styles.displayBox}>
          <div className={styles.displayBoxLeft}>
            <img className={styles.cloudLogoIcon} src={cloudLogo} alt='로고' />
            <span>{userDisplay}</span>
            <span className={styles.dot}></span>
            <span>{DateTime.format(createdAt, 'YMD')}</span>
            {isEdited && <span>&nbsp;(수정됨)</span>}
            {isConfirmed && <Icon id='check-circle' width={15} height={15} />}
          </div>

          <Icon
            className={styles.more}
            id='meat-ball'
            onClick={() =>
              isWriter
                ? setModal({ id: 'my-exam-review-more-options' })
                : setModal({ id: 'exam-review-more-options' })
            }
            width={18}
            height={4}
            stroke='none'
          />
        </div>

        <div className={styles.title}>{title}</div>

        <div className={styles.info}>
          <ReviewContentItem tag='강의명' value={lectureName} />
          <ReviewContentItem tag='교수' value={professor} />
          <ReviewContentItem tag='강의 종류' value={COURSE_TYPE[lectureType]} />
          <ReviewContentItem
            tag='수강 학기'
            value={`${String(lectureYear % 100).padStart(2, '0')}-${SEMESTER[semester]}`}
          />
          <ReviewContentItem tag='시험 종류' value={EXAM_TYPE[examType]} />
          <ReviewContentItem tag='P/F' value={isPF ? 'O' : 'X'} />
          <ReviewContentItem tag='온라인 수업' value={isOnline ? 'O' : 'X'} />
          <ReviewContentItem
            tag='시험 유형 및 문항수'
            value={questionDetail}
            align={FLEX_ALIGN.flexStart}
          />
        </div>

        <ReviewDownload
          className={styles.fileDownload}
          fileName={fileName}
          isDownloaded={isDownloaded}
          isWriter={isWriter}
        />

        <ActionContainer
          commentCount={commentCount}
          isScrapped={isScrapped}
          scrapCount={scrapCount}
        />
      </div>

      <CommentListSuspense commentCount={commentCount} />
      <CommentInput />

      {/* 시험후기 관련 모달 렌더링 */}
      <ExamReviewModalRenderer
        modal={modal}
        handleEdit={handleEdit}
        handleReport={handleReport}
        handleDelete={handleDelete}
      />

      {isLoading && <FetchLoadingOverlay />}
    </section>
  );
}

function ActionContainer({ commentCount, isScrapped, scrapCount }) {
  const { inputFocus, focusedItem } = useCommentContext();
  const { scrap, unscrap } = useScrap();

  return (
    <div className={styles.actionContainer}>
      <div
        className={styles.count}
        styles={{
          backgroundColor:
            focusedItem === 'post' ? 'var(--blue-1)' : 'transparent',
        }}
        onClick={inputFocus}
      >
        <Icon
          id='comment-stroke'
          width={18}
          height={15}
          styles={{
            paddingTop: '0.1rem',
          }}
          stroke='var(--blue-3)'
          fill='none'
        />
        <p>댓글 {commentCount.toLocaleString()}</p>
      </div>

      <div
        className={styles.count}
        onClick={() => (isScrapped ? unscrap.mutate() : scrap.mutate())}
      >
        <Icon
          id='scrap-stroke'
          width={13}
          height={17}
          stroke={'var(--green-1)'}
          fill={isScrapped ? 'var(--green-1)' : 'none'}
        />
        <p>스크랩 {scrapCount.toLocaleString()}</p>
      </div>
    </div>
  );
}
