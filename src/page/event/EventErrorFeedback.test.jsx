import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import { ModalContext } from '@/shared/context/ModalContext';
import { ToastProvider } from '@/shared/context/ToastContext';

import { getEventContentText } from '@/feature/event/lib/content';

import { getEventContent, patchEvent, postEvent } from '@/apis';

import EditEventPage from './EditEventPage/EditEventPage';
import WriteEventPage from './WriteEventPage/WriteEventPage';

jest.mock(
  '@snorose/icons',
  () => {
    const Icon = () => <svg aria-hidden='true' />;
    return {
      IconChevronDown: Icon,
      IconMultiClipboardBlue: Icon,
      IconMultiCloudLogo: Icon,
      IllustrationTrashcanCircle: Icon,
      IconMultiCheckGreenCircle: Icon,
      IconMultiExclamationTriangle: Icon,
      IconMultiInfoCircle: Icon,
      IconImage: Icon,
      IconVideo: Icon,
      IconX: Icon,
    };
  },
  { virtual: true }
);
jest.mock('@/shared/component', () => ({
  ActionButton: jest.requireActual(
    '@/shared/component/button/ActionButton/ActionButton'
  ).default,
  PrimaryButton: jest.requireActual(
    '@/shared/component/button/PrimaryButton/PrimaryButton'
  ).default,
  Toast: jest.requireActual('@/shared/component/Toast/Toast').default,
  AttachmentList: jest.requireActual(
    '@/shared/component/AttachmentList/AttachmentList'
  ).default,
  BackAppBar: () => null,
  Badge: () => null,
  CloseAppBar: ({ children }) => <div>{children}</div>,
  ConfirmModal: () => null,
  FetchLoading: () => null,
}));
jest.mock('@/shared/context', () => ({
  ModalContext: jest.requireActual('@/shared/context/ModalContext')
    .ModalContext,
}));
jest.mock('@/shared/constant', () => ({
  ...jest.requireActual('@/shared/constant/attachment'),
  ...jest.requireActual('@/shared/constant/reactQuery'),
  BOARD_MENUS: [{ id: 14, textId: 'event' }],
  ROLE: { admin: 4, official: 5 },
  TOAST: { POST: { edit: '게시글이 수정되었어요' } },
  ATTACHMENT_MODAL_TEXT: {},
  CONFIRM_MODAL_TEXT: {},
}));
jest.mock('@/shared/hook', () => ({
  useToast: jest.requireActual('@/shared/hook/useToast').default,
  useAuth: () => ({
    userInfo: { userRoleId: 4 },
    status: 'success',
    invalidUserInfoQuery: jest.fn(),
  }),
  useBlocker: () => {},
  useModal: () => ({ isOpen: false }),
}));
jest.mock('@/shared/lib', () => ({
  DateTime: { format: () => '11/05 12:00' },
  getBoard: () => ({ id: 14 }),
}));
jest.mock('@/feature/board/component', () => ({
  AttachmentBar: () => null,
  DropDownMenu: jest.requireActual(
    '@/feature/board/component/DropDownMenu/DropDownMenu'
  ).default,
}));
jest.mock('@/feature/editor/lib', () => ({
  preserveEmptyParagraphs: (html) => html,
  sanitizeHtml: (html) => html,
}));
jest.mock('@/feature/editor/component', () => ({
  EditorContainer: ({ text, placeholder, onEditorReady, onChangeEditor }) => {
    const React = require('react');
    const [value, setValue] = React.useState(text || '');
    const valueRef = React.useRef(value);
    const onEditorReadyRef = React.useRef(onEditorReady);
    const editorRef = React.useRef({
      commands: {
        setContent: (html) => {
          valueRef.current = html;
          setValue(html);
        },
      },
      getHTML: () => valueRef.current,
      setEditable: () => {},
    });
    React.useEffect(() => {
      onEditorReadyRef.current(editorRef.current);
    }, []);
    return (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(event) => {
          valueRef.current = event.target.value;
          setValue(event.target.value);
          onChangeEditor(editorRef.current);
        }}
      />
    );
  },
}));
jest.mock('@/feature/event/component', () => ({
  EventForm: (props) => {
    const EventForm = jest.requireActual(
      '@/feature/event/component/EventForm/EventForm'
    ).default;
    return <EventForm {...props} />;
  },
  TextField: (props) => {
    const TextField = jest.requireActual(
      '@/feature/event/component/TextField/TextField'
    ).default;
    return <TextField {...props} />;
  },
  DateField: (props) => {
    const DateField = jest.requireActual(
      '@/feature/event/component/DateField/DateField'
    ).default;
    return <DateField {...props} />;
  },
  NoticeForm: () => null,
}));
jest.mock(
  '@/feature/event/component/EventEditorToolbar/EventEditorToolbar',
  () => () => null
);
jest.mock('@/apis', () => ({
  getEventContent: jest.fn(),
  patchEvent: jest.fn(),
  postEvent: jest.fn(),
  postPost: jest.fn(),
  createThumbnail: jest.fn(),
}));

const event = {
  postId: '42',
  category: '기타',
  isNotice: false,
  title: '이벤트 제목',
  host: '주최사',
  content: '수정하고 싶은 이벤트 본문',
  link: 'https://example.com',
};

let queryClient;
let toastPortal;

beforeEach(() => {
  jest.clearAllMocks();
  getEventContent.mockResolvedValue(event);
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false, gcTime: Infinity },
    },
  });
  toastPortal = document.createElement('div');
  toastPortal.id = 'toast';
  document.body.appendChild(toastPortal);
});

afterEach(() => {
  cleanup();
  queryClient.clear();
  toastPortal.remove();
});

function renderPage(mode) {
  const path =
    mode === '작성'
      ? '/board/event/event-post-write'
      : '/board/event/post/42/edit';

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <ModalContext.Provider
          value={{ modal: { id: null }, setModal: jest.fn() }}
        >
          <ToastProvider>
            <Routes>
              <Route
                path='/board/event/event-post-write'
                element={<WriteEventPage />}
              />
              <Route
                path='/board/event/post/:postId/edit'
                element={<EditEventPage />}
              />
            </Routes>
          </ToastProvider>
        </ModalContext.Provider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

const javaError =
  'Cannot invoke "java.util.List.stream()" because "finalAttachmentRequests" is null';

test.each([
  ['영화', '기타'],
  ['기타', '연극/뮤지컬'],
  ['연극/뮤지컬', '영화'],
])(
  '%s에서 %s로 바꾸면 본문·입력값·첨부·오류를 함께 초기화한다',
  async (from, to) => {
    renderPage('작성');
    fireEvent.click(screen.getByText('유형을 선택해주세요'));
    fireEvent.click(screen.getByText(from));
    fireEvent.change(screen.getByLabelText('제목'), {
      target: { value: '이전 유형의 제목' },
    });
    const bodyPlaceholder =
      '이벤트 추첨 방식, 유의사항 등 상세한 설명을 입력해주세요';
    fireEvent.change(screen.getByPlaceholderText(bodyPlaceholder), {
      target: { value: '<p><strong>이전 유형의 본문입니다</strong></p>' },
    });
    fireEvent.change(screen.getByLabelText('신청 링크'), {
      target: { value: 'https://example.com' },
    });
    fireEvent.change(screen.getByLabelText('추첨 인원'), {
      target: { value: '10명' },
    });
    fireEvent.change(screen.getByLabelText('이미지 첨부'), {
      target: {
        files: [new File(['image'], 'before.png', { type: 'image/png' })],
      },
    });
    expect(
      screen.getByRole('button', { name: 'before.png 삭제' })
    ).toBeInTheDocument();
    if (from !== '기타') {
      fireEvent.change(screen.getByLabelText('장소'), {
        target: { value: '가'.repeat(21) },
      });
    }
    expect(
      screen.queryAllByText('장소는 20자 이하로 입력해주세요')
    ).toHaveLength(from === '기타' ? 0 : 1);

    fireEvent.click(
      screen.getByText(from, { selector: '.categorySelectText' })
    );
    fireEvent.click(screen.getByText(to));
    await waitFor(() =>
      expect(screen.getByPlaceholderText(bodyPlaceholder)).toHaveValue('')
    );
    for (const label of ['제목', '신청 링크', '추첨 인원']) {
      expect(screen.getByLabelText(label)).toHaveValue('');
    }
    expect(
      screen.queryByRole('button', { name: 'before.png 삭제' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('장소는 20자 이하로 입력해주세요')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '등록' })).toBeDisabled();
  }
);

describe.each(['작성', '수정'])('이벤트 %s 실패 안내', (mode) => {
  test.each([
    [
      '정의된 메시지',
      { response: { data: { message: '저장할 수 없어요' } } },
      '저장할 수 없어요',
    ],
    [
      '문자열 서버 응답',
      {
        response: { data: javaError },
        message: 'Request failed with status code 500',
      },
      javaError,
    ],
    [
      '다른 JSON 형식',
      { response: { data: { code: 'UNKNOWN', reason: '첨부 처리 실패' } } },
      '{"code":"UNKNOWN","reason":"첨부 처리 실패"}',
    ],
    ['네트워크 오류', new Error('Network Error'), 'Network Error'],
    [
      '빈 서버 메시지',
      { response: { data: { message: '   ' } }, message: '요청 시간 초과' },
      '요청 시간 초과',
    ],
    ['오류 정보 없음', null, null],
  ])(
    '%s도 토스트로 표시하고 본문을 보존한다',
    async (_name, error, message) => {
      const saveEvent = mode === '작성' ? postEvent : patchEvent;
      saveEvent.mockRejectedValue(error);
      renderPage(mode);

      if (mode === '작성') {
        fireEvent.click(screen.getByText('유형을 선택해주세요'));
        fireEvent.click(screen.getByText('기타'));
        for (const [placeholder, value] of [
          ['이벤트 제목을 입력해주세요', event.title],
          ['주최사를 입력해주세요', event.host],
          [
            '이벤트 추첨 방식, 유의사항 등 상세한 설명을 입력해주세요',
            event.content,
          ],
        ]) {
          fireEvent.change(screen.getByPlaceholderText(placeholder), {
            target: { value },
          });
        }
        fireEvent.change(screen.getByLabelText('신청 링크'), {
          target: { value: event.link },
        });
      }

      const submit = await screen.findByRole('button', {
        name: mode === '작성' ? '등록' : '수정',
      });
      await waitFor(() => expect(submit).toBeEnabled());
      fireEvent.click(submit);

      const expectedMessage =
        message ||
        (mode === '작성'
          ? '게시글 등록에 실패했어요.'
          : '게시글 수정에 실패했어요.');
      expect(await screen.findByText(expectedMessage)).toBeInTheDocument();
      expect(saveEvent).toHaveBeenCalledTimes(1);
      expect(
        getEventContentText(
          screen.getByPlaceholderText(
            '이벤트 추첨 방식, 유의사항 등 상세한 설명을 입력해주세요'
          ).value
        )
      ).toBe(event.content);
    }
  );
});
