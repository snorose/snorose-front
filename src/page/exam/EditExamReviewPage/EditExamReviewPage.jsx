import { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';

import { editReviewDetail } from '@/apis';

import { useBlocker, useToast } from '@/shared/hook';
import { ModalContext } from '@/shared/context/ModalContext';
import {
  ActionButton,
  CheckBox,
  CloseAppBar,
  ConfirmModal,
  Dropdown,
  FetchLoadingOverlay,
  Label,
  NumberInput,
  Textarea,
  TextInput,
} from '@/shared/component';
import {
  MUTATION_KEY,
  QUERY_KEY,
  TOAST,
  CONFIRM_MODAL_TEXT,
} from '@/shared/constant';

import { CategoryButton } from '@/feature/exam/component';
import {
  EXAM_TYPES,
  LECTURE_TYPES,
  SEMESTERS,
  YEARS,
} from '@/feature/exam/constant';

import styles from './EditExamReviewPage.module.css';

export default function EditExamReviewPage() {
  const { postId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState();
  const { modal, setModal } = useContext(ModalContext);

  const [lectureName, setLectureName] = useState(state.lectureName);
  const [professor, setProfessor] = useState(state.professor);
  const [lectureType, setLectureType] = useState(
    LECTURE_TYPES.find((type) => type.id === state.lectureType)
  );
  const [examType, setExamType] = useState(
    EXAM_TYPES.find((type) => type.id === state.examType)
  );
  const [lectureYear, setLectureYear] = useState(
    YEARS.find((year) => year.id === state.lectureYear)
  );
  const [semester, setSemester] = useState(
    SEMESTERS.find((semester) => semester.id === state.semester)
  );
  const [isPF, setIsPF] = useState(state.isPF);
  const [isOnline, setIsOnline] = useState(state.isOnline);
  const [classNumber, setClassNumber] = useState(String(state.classNumber));
  const [questionDetail, setQuestionDetail] = useState(state.questionDetail);

  // navigation guard
  const [isBlock, setIsBlock] = useState(false);

  useEffect(() => {
    setIsBlock(
      state.lectureName !== lectureName.trim() ||
        state.professor !== professor.trim() ||
        state.lectureType !== lectureType.id ||
        state.examType !== examType.id ||
        state.lectureYear !== lectureYear.id ||
        state.semester !== semester.id ||
        state.classNumber !== classNumber ||
        state.questionDetail !== questionDetail.trim()
    );
  }, [
    lectureName,
    professor,
    lectureType.id,
    examType.id,
    lectureYear.id,
    semester.id,
    classNumber,
    questionDetail,
  ]);

  useBlocker(isBlock);

  // 게시글 수정 중 페이지 이탈
  const handleExitPage = () => {
    setModal({
      id: null,
      type: null,
    });
    setIsBlock(false);
    navigate(-1);
  };

  const pass =
    lectureName.trim() &&
    professor.trim() &&
    lectureType &&
    examType &&
    lectureYear &&
    semester &&
    classNumber &&
    questionDetail.trim();

  const data = {
    isPF,
    classNumber: Number(classNumber),
    lectureName,
    professor,
    questionDetail,
    semester: semester?.id,
    lectureType: lectureType?.id,
    examType: examType?.id,
    lectureYear: lectureYear?.id,
    isOnline,
  };

  const editReview = useMutation({
    mutationKey: [MUTATION_KEY.editExamReview],
    mutationFn: (edit) => editReviewDetail(postId, edit),
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.post(postId));
      navigate(-1);
      toast({ message: TOAST.EXAM_REVIEW.edit, variant: 'success' });
    },
    onError: ({ response }) => {
      toast({ message: response.data.message, variant: 'error' });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  return (
    <main className={styles.container}>
      <CloseAppBar>
        <ActionButton
          onClick={() => {
            setLoading(true);
            setIsBlock(false);
            editReview.mutate(data);
          }}
          disabled={!pass}
        >
          수정
        </ActionButton>
      </CloseAppBar>

      <div className={styles.top}>
        <div className={styles.field}>
          <Label htmlFor='lectureName' required>
            강의명
          </Label>
          <TextInput
            id='lectureName'
            value={lectureName}
            onChange={(next) => setLectureName(next)}
            placeholder='강의명을 입력해주세요'
          />
        </div>

        <div className={styles.field}>
          <Label htmlFor='professor' required>
            교수명
          </Label>
          <TextInput
            id='professor'
            value={professor}
            onChange={(next) => setProfessor(next)}
            placeholder='교수명을 입력해주세요'
          />
        </div>

        <div className={styles.field}>
          <Label htmlFor='classNumber' required>
            수강 분반
          </Label>
          <NumberInput
            id='classNumber'
            maxLength={3}
            value={classNumber}
            onChange={(next) => setClassNumber(next)}
            placeholder='수강분반을 입력해주세요'
          />
        </div>

        <div className={styles.field}>
          <Label htmlFor='semester' required>
            수강 연도
          </Label>
          <div className={styles.dropdown}>
            <Dropdown
              options={YEARS}
              select={lectureYear}
              setFn={setLectureYear}
              placeholder='수강연도를 선택해주세요'
            />
          </div>
        </div>

        <div className={styles.field}>
          <Label htmlFor='semester' required>
            수강 학기
          </Label>
          <Dropdown
            options={SEMESTERS}
            select={semester}
            setFn={setSemester}
            placeholder='수강학기를 선택해주세요'
          />
        </div>

        <div className={styles.field}>
          <Label required>강의 종류</Label>
          <div className={styles.cagetories}>
            {LECTURE_TYPES.map((option) => (
              <CategoryButton
                key={option.id}
                select={lectureType}
                option={option}
                callback={setLectureType}
              >
                {option.name}
              </CategoryButton>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <Label required>시험 종류</Label>
          <div className={styles.cagetories}>
            {EXAM_TYPES.map((option) => (
              <CategoryButton
                key={option.id}
                select={examType}
                option={option}
                callback={setExamType}
              >
                {option.name}
              </CategoryButton>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={`${styles.field} ${styles.checkbox}`}>
          <Label htmlFor='isPF'>P/F 수업이에요</Label>
          <CheckBox
            id='isPF'
            checked={isPF}
            onChange={(next) => setIsPF(next)}
          />
        </div>

        <div className={`${styles.field} ${styles.checkbox}`}>
          <Label htmlFor='isOnline'>온라인(비대면) 수업이에요</Label>
          <CheckBox
            id='isOnline'
            checked={isOnline}
            onChange={(next) => setIsOnline(next)}
          />
        </div>

        <div className={styles.field}>
          <Label htmlFor='questionDetail' required>
            문항 수 및 시험 유형 설명
          </Label>
          <Textarea
            id='questionDetail'
            value={questionDetail}
            onChange={(next) => setQuestionDetail(next)}
            placeholder='강의, 시험 유형 및 부가적인 설명을 기술해주세요'
            minRows='5'
            maxRows='10'
          />
        </div>
      </div>

      {loading && <FetchLoadingOverlay />}
      {/* 페이지 이탈 방지 모달 */}
      {modal.id === 'exit-page' && (
        <ConfirmModal
          modalText={CONFIRM_MODAL_TEXT.EXIT_PAGE}
          onConfirm={handleExitPage}
        />
      )}
    </main>
  );
}
