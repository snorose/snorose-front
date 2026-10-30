import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QUERY_KEY } from '@/shared/constant';
import { ModalProvider } from '@/shared/context/ModalContext';
import { ToastProvider } from '@/shared/context/ToastContext';
import { AppError } from '@/shared/lib';

import { ERROR_CODE } from '@/feature/alert/constant';
import { PushNotificationManager } from '@/feature/alert/lib';
import CommentInput from '@/feature/comment/component/CommentInput/CommentInput';
import { CommentContextProvider } from '@/feature/comment/context/CommentContext';
import ReviewDownload from '@/feature/exam/component/ReviewDownload/ReviewDownload';
import { useDeleteExamReviewHandler } from '@/feature/exam/hook/useDeleteExamReviewHandler';

import AlertSettingPage from '@/page/alert/AlertSettingPage/AlertSettingPage';
import ChangePwPage from '@/page/user/ChangePwPage/ChangePwPage';

import {
  deleteExamReview,
  fetchNotificationSettings,
  getExamReview,
  postComment,
  updateNotificationSettings,
  updatePassword,
} from '@/apis';

// Keep the real consumers, mutations, router, useToast, provider and rendered Toast.
// Select actual exports instead of loading unrelated modules from large barrels.
// The app bar and icon artwork are outside this migration's behavior boundary.
jest.mock('@/shared/component', () => ({
  Toast: jest.requireActual('@/shared/component/Toast/Toast').default,
  ActionButton: jest.requireActual(
    '@/shared/component/button/ActionButton/ActionButton'
  ).default,
  PasswordInput: jest.requireActual(
    '@/shared/component/form/input/PasswordInput'
  ).default,
  Label: jest.requireActual('@/shared/component/form/Label/Label').default,
  ErrorMessage: jest.requireActual(
    '@/shared/component/form/ErrorMessage/ErrorMessage'
  ).default,
  ConfirmModal: jest.requireActual(
    '@/shared/component/modal/ConfirmModal/ConfirmModal'
  ).default,
  DimModalLayout: jest.requireActual(
    '@/shared/component/modal/DimModalLayout/DimModalLayout'
  ).default,
  FetchLoading: jest.requireActual(
    '@/shared/component/loading/FetchLoading/FetchLoading'
  ).default,
  FetchLoadingOverlay: jest.requireActual(
    '@/shared/component/loading/FetchLoadingOverlay/FetchLoadingOverlay'
  ).default,
  BackAppBar: () => null,
}));
jest.mock('@/shared/hook', () => ({
  useToast: jest.requireActual('./useToast').default,
  useAuth: () => ({ invalidUserInfoQuery: jest.fn() }),
}));
jest.mock('@/shared/constant', () => ({
  ...jest.requireActual('@/shared/constant/toast'),
  ...jest.requireActual('@/shared/constant/reactQuery'),
  ...jest.requireActual('@/shared/constant/modalText'),
  ...jest.requireActual('@/shared/constant/loading'),
  ...jest.requireActual('@/shared/constant/type'),
  ...jest.requireActual('@/shared/constant/board'),
}));
jest.mock('@/shared/lib', () => ({
  ...jest.requireActual('@/shared/lib/AppError'),
  ...jest.requireActual('@/shared/lib/pagination'),
  ...jest.requireActual('@/shared/lib/getBoardTextId'),
  DateTime: jest.requireActual('@/shared/lib/date-time'),
}));
jest.mock('@/feature/comment/hook', () => ({
  useComment: jest.requireActual('@/feature/comment/hook/useComment').default,
}));
jest.mock('@/feature/alert/component', () => ({
  SettingItem: jest.requireActual(
    '@/feature/alert/component/SettingItem/SettingItem'
  ).default,
}));
jest.mock('@/feature/alert/lib', () => ({
  canUseAlertSetting: () => true,
  getDeviceType: () => 'ANDROID',
  PushNotificationManager: {
    ensurePermission: jest.fn(),
    issueToken: jest.fn(),
    isTokenChanged: () => false,
    syncWithServer: jest.fn(),
  },
}));
jest.mock('@/apis', () => ({
  updatePassword: jest.fn(),
  postComment: jest.fn(),
  deleteComment: jest.fn(),
  editComment: jest.fn(),
  deleteExamReview: jest.fn(),
  getExamReview: jest.fn(),
  fetchNotificationSettings: jest.fn(),
  updateNotificationSettings: jest.fn(),
}));
jest.mock(
  '@snorose/icons',
  () => {
    const Icon = (props) => <svg {...props} />;
    return {
      IconEye: Icon,
      IconEyeFill: Icon,
      IconArrowUpRight: Icon,
      IconMultiCloudLogo: Icon,
      IconFile: Icon,
      IconMultiCheckGreenCircle: () => <svg aria-label='success toast' />,
      IconMultiExclamationTriangle: () => <svg aria-label='error toast' />,
      IconMultiInfoCircle: () => <svg aria-label='info toast' />,
    };
  },
  { virtual: true }
);

let queryClient;
let toastPortal;
let modalPortal;

beforeEach(() => {
  jest.clearAllMocks();
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false, gcTime: Infinity },
    },
  });
  queryClient.setQueryData([QUERY_KEY.userInfo], { points: 100, balance: 100 });
  queryClient.setQueryData(QUERY_KEY.post('42'), {
    commentCount: 0,
    isDownloaded: false,
  });
  toastPortal = document.createElement('div');
  toastPortal.id = 'toast';
  modalPortal = document.createElement('div');
  modalPortal.id = 'modal';
  document.body.append(toastPortal, modalPortal);
  PushNotificationManager.ensurePermission.mockResolvedValue(undefined);
  PushNotificationManager.issueToken.mockResolvedValue('test-token');
  fetchNotificationSettings.mockResolvedValue({
    isRequiredConsent: false,
    isMarketingConsent: false,
    isAttendanceConsent: false,
  });
  jest.spyOn(console, 'table').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  queryClient.clear();
  toastPortal.remove();
  modalPortal.remove();
  jest.restoreAllMocks();
});

function renderConsumer(element, path = '/board/first-snow/42') {
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ModalProvider>
          <MemoryRouter
            initialEntries={['/reviews', path]}
            initialIndex={1}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <Routes>
              <Route path='/board/:board/:postId' element={element} />
              <Route path='/change-password' element={element} />
              <Route path='/alert-setting' element={element} />
              <Route path='/my-page' element={<h1>내 정보</h1>} />
              <Route path='/reviews' element={<h1>시험후기 목록</h1>} />
            </Routes>
          </MemoryRouter>
        </ModalProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

async function expectToast(message, variant) {
  expect(await within(toastPortal).findByText(message)).toBeVisible();
  expect(
    within(toastPortal).getByLabelText(`${variant} toast`)
  ).toBeInTheDocument();
  expect(within(toastPortal).getAllByText(message)).toHaveLength(1);
}

function enterPasswords() {
  fireEvent.change(screen.getByLabelText('현재 비밀번호'), {
    target: { value: 'Oldpass1!' },
  });
  fireEvent.change(screen.getByLabelText('새 비밀번호'), {
    target: { value: 'Newpass2!' },
  });
  fireEvent.change(screen.getByLabelText('새 비밀번호 확인'), {
    target: { value: 'Newpass2!' },
  });
}

describe('비밀번호 변경 화면 → 실제 mutation → Toast', () => {
  it('저장 성공 시 페이지가 이동해도 성공 메시지가 유지된다', async () => {
    updatePassword.mockResolvedValue({});
    renderConsumer(<ChangePwPage />, '/change-password');
    enterPasswords();
    userEvent.click(screen.getByRole('button', { name: '완료' }));
    await expectToast('비밀번호가 수정되었어요', 'success');
    expect(
      screen.getByRole('heading', { name: '내 정보' })
    ).toBeInTheDocument();
    expect(updatePassword).toHaveBeenCalledTimes(1);
    expect(updatePassword).toHaveBeenCalledWith({
      currentPassword: 'Oldpass1!',
      newPassword: 'Newpass2!',
    });
  });

  it('저장 실패 시 서버 오류 메시지를 표시하고 화면과 입력을 유지한다', async () => {
    updatePassword.mockRejectedValue({
      response: { data: { message: '현재 비밀번호가 다릅니다' } },
    });
    renderConsumer(<ChangePwPage />, '/change-password');
    enterPasswords();
    userEvent.click(screen.getByRole('button', { name: '완료' }));
    await expectToast('현재 비밀번호가 다릅니다', 'error');
    expect(
      screen.getByRole('heading', { name: '비밀번호 변경' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('새 비밀번호')).toHaveValue('Newpass2!');
  });
});

function renderComments() {
  renderConsumer(
    <CommentContextProvider>
      <CommentInput />
    </CommentContextProvider>
  );
}

function submitComment(content) {
  const input = screen.getByPlaceholderText('댓글을 입력하세요');
  fireEvent.change(input, { target: { value: content } });
  fireEvent.keyDown(input, { key: 'Enter', ctrlKey: true, metaKey: true });
}

describe('댓글 입력 검증 및 저장 흐름', () => {
  it.each(['', '   '])(
    '빈 내용 %j은 안내 Toast를 표시하고 API를 호출하지 않는다',
    async (content) => {
      renderComments();
      submitComment(content);
      await expectToast('댓글 내용을 입력하세요', 'info');
      expect(postComment).not.toHaveBeenCalled();
    }
  );

  it('1000자를 초과하면 안내하고 API를 호출하지 않는다', async () => {
    renderComments();
    submitComment('가'.repeat(1001));
    await expectToast('댓글은 1,000자 이내로 작성해주세요', 'info');
    expect(postComment).not.toHaveBeenCalled();
  });

  it.each([
    [0, '댓글을 등록했어요'],
    [1, '댓글을 등록했어요 (+1P)'],
  ])(
    '포인트 %i 분기의 성공 문구를 보존한다',
    async (pointDifference, message) => {
      postComment.mockResolvedValue({
        id: 1,
        content: '새 댓글',
        children: [],
        pointDifference,
      });
      renderComments();
      submitComment('새 댓글');
      await expectToast(message, 'success');
      expect(postComment).toHaveBeenCalledWith({
        postId: '42',
        parentId: undefined,
        content: '새 댓글',
      });
      expect(screen.getByPlaceholderText('댓글을 입력하세요')).toHaveValue('');
    }
  );

  it('등록 실패 시 오류 문구를 표시하고 작성한 댓글을 보존한다', async () => {
    postComment.mockRejectedValue({
      response: { data: { message: '댓글 등록에 실패했어요' } },
    });
    renderComments();
    submitComment('새 댓글');
    await expectToast('댓글 등록에 실패했어요', 'error');
    expect(screen.getByPlaceholderText('댓글을 입력하세요')).toHaveValue(
      '새 댓글'
    );
  });
});

function DeleteReviewConsumer() {
  const { handleDelete, submitDisabled } = useDeleteExamReviewHandler();
  return (
    <button onClick={handleDelete} disabled={submitDisabled}>
      시험후기 삭제
    </button>
  );
}

describe('시험후기 삭제의 실제 hook 소비자', () => {
  it('삭제 실패 시 기본 안내가 아닌 오류 Toast를 표시한다', async () => {
    deleteExamReview.mockRejectedValue({
      response: { data: { message: '삭제할 수 없는 시험후기예요' } },
    });
    renderConsumer(<DeleteReviewConsumer />);
    userEvent.click(screen.getByRole('button', { name: '시험후기 삭제' }));
    await expectToast('삭제할 수 없는 시험후기예요', 'error');
    expect(deleteExamReview).toHaveBeenCalledWith('42');
    expect(screen.getByRole('button', { name: '시험후기 삭제' })).toBeEnabled();
  });

  it('삭제 성공 후 뒤로 이동해도 성공 Toast가 표시된다', async () => {
    deleteExamReview.mockResolvedValue({ status: 200 });
    renderConsumer(<DeleteReviewConsumer />);
    userEvent.click(screen.getByRole('button', { name: '시험후기 삭제' }));
    await expectToast('시험후기가 삭제되었어요', 'success');
    expect(
      screen.getByRole('heading', { name: '시험후기 목록' })
    ).toBeInTheDocument();
  });
});

describe('시험후기 다운로드 확인 모달', () => {
  it('취소 시 다운로드와 Toast를 발생시키지 않는다', () => {
    renderConsumer(<ReviewDownload fileName='review.pdf' />);
    userEvent.click(screen.getByRole('button', { name: 'review.pdf' }));
    userEvent.click(screen.getByRole('button', { name: '취소' }));
    expect(getExamReview).not.toHaveBeenCalled();
    expect(toastPortal).toBeEmptyDOMElement();
  });

  it('확인 후 다운로드 실패 응답을 파싱해 오류 Toast를 표시한다', async () => {
    getExamReview.mockRejectedValue({
      response: {
        data: {
          text: async () =>
            JSON.stringify({ message: '다운로드 포인트가 부족해요' }),
        },
      },
    });
    renderConsumer(<ReviewDownload fileName='review.pdf' />);
    userEvent.click(screen.getByRole('button', { name: 'review.pdf' }));
    userEvent.click(screen.getByRole('button', { name: '확인' }));
    await expectToast('다운로드 포인트가 부족해요', 'error');
    expect(getExamReview).toHaveBeenCalledWith('42', 'review.pdf');
    expect(queryClient.getQueryData([QUERY_KEY.userInfo]).balance).toBe(100);
  });
});

describe('알림 설정의 오류 및 안내 분기', () => {
  async function loadNotificationSwitch() {
    const { container } = renderConsumer(
      <AlertSettingPage />,
      '/alert-setting'
    );
    await screen.findByText('알림 받기');
    // Production Switch has no role/name; keep the real widget and target its CSS class.
    // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
    return container.querySelector('.switch');
  }

  it('저장 실패 시 문자열 오류 메시지를 표시하고 스위치를 원래 상태로 되돌린다', async () => {
    updateNotificationSettings.mockRejectedValue(
      new Error('알림 설정 저장에 실패했어요')
    );
    const toggle = await loadNotificationSwitch();
    userEvent.click(toggle);
    await expectToast('알림 설정 저장에 실패했어요', 'error');
    expect(updateNotificationSettings).toHaveBeenCalledWith({
      isRequiredConsent: true,
      isMarketingConsent: false,
      isAttendanceConsent: false,
    });
    expect(toggle).toHaveClass('off');
  });

  it('권한 설정 실패 시 안내 Toast를 표시하고 저장 요청을 보내지 않는다', async () => {
    PushNotificationManager.ensurePermission.mockRejectedValue(
      new AppError(
        ERROR_CODE.PERMISSION_BLOCKED,
        '기기에서 알림 권한을 켜주세요'
      )
    );
    const toggle = await loadNotificationSwitch();
    userEvent.click(toggle);
    await expectToast('기기에서 알림 권한을 켜주세요', 'info');
    expect(updateNotificationSettings).not.toHaveBeenCalled();
    expect(toggle).toHaveClass('off');
  });
});
