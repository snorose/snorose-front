import { MemoryRouter, useLocation } from 'react-router-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ModalContext } from '@/shared/context';

import { createThumbnail, postEvent, postPost } from '@/apis';

import WriteEventPage from './WriteEventPage';

const mockQueryClient = { removeQueries: jest.fn() };
const mockInvalidUserInfoQuery = jest.fn();
const mockToast = { error: jest.fn(), info: jest.fn() };

jest.mock(
  '@snorose/icons',
  () => {
    const Icon = (props) => <svg aria-hidden='true' {...props} />;
    return {
      IconChevronDown: Icon,
      IconGripHorizontal: Icon,
      IconMultiClipboardBlue: Icon,
      IconMultiCloudLogo: Icon,
      IconMultiVideo: Icon,
      IconHashtag: Icon,
      IconHashtagThick: Icon,
      IconImage: Icon,
      IconImageFill: Icon,
      IconOpenEditor: Icon,
      IconOpenEditorThick: Icon,
      IconVideo: Icon,
      IconVideoFill: Icon,
      IconX: Icon,
      IllustrationTrashcanCircle: (props) => (
        <div data-testid='trash' {...props} />
      ),
    };
  },
  { virtual: true }
);
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => mockQueryClient,
}));
jest.mock('@/shared/component', () => ({
  ActionButton: ({ children, ...props }) => (
    <button {...props}>{children}</button>
  ),
  AttachmentList: jest.requireActual(
    '@/shared/component/AttachmentList/AttachmentList'
  ).default,
  Badge: () => null,
  CloseAppBar: ({ children }) => <div>{children}</div>,
  ConfirmModal: ({ onConfirm }) => (
    <button onClick={onConfirm}>삭제 확인</button>
  ),
  FetchLoading: () => null,
}));
jest.mock('@/shared/constant', () => ({
  ATTACHMENT_EXTENSION_LIMIT: {
    imageExtensions: ['.jpg', '.png'],
    videoExtensions: ['.mp4'],
  },
  ATTACHMENT_SIZE_LIMIT: {
    imageQuantity: 10,
    imageFileSize: 1000000,
    videoQuantity: 1,
    videoFileSize: 1000000,
  },
  ATTACHMENT_MODAL_TEXT: { DELETE_ATTACHMENT: '삭제' },
  CONFIRM_MODAL_TEXT: {},
  QUERY_KEY: { post: () => ['post'], notices: 'notices' },
  ROLE: { admin: 4, official: 5 },
  TOAST: { POST: { emptyTitle: '제목', emptyContent: '내용' } },
}));
jest.mock('@/shared/hook', () => ({
  useAuth: () => ({
    userInfo: { userRoleId: 4, nickname: '관리자' },
    status: 'success',
    invalidUserInfoQuery: mockInvalidUserInfoQuery,
  }),
  useBlocker: () => {},
  useModal: () => {
    const [isOpen, setIsOpen] = require('react').useState(false);
    return {
      isOpen,
      openModal: () => setIsOpen(true),
      closeModal: () => setIsOpen(false),
    };
  },
  useToast: () => ({ toast: mockToast }),
}));
jest.mock('@/shared/lib', () => ({
  DateTime: { format: () => '' },
  getBoard: () => ({ id: 14 }),
}));
jest.mock('@/feature/board/component', () => ({
  AttachmentBar: jest.requireActual(
    '@/feature/board/component/AttachmentBar/AttachmentBar'
  ).default,
  DropDownMenu: jest.requireActual(
    '@/feature/board/component/DropDownMenu/DropDownMenu'
  ).default,
}));
jest.mock('@/feature/editor/component', () => ({
  FixedMenuEditor: () => <div data-testid='editor-toolbar' />,
  EditorContainer: ({ onEditorReady, onChangeEditor }) => {
    require('react').useEffect(() => {
      const editor = {
        getText: () => '공지 본문',
        getHTML: () => '<p>공지 본문</p>',
      };
      onEditorReady(editor);
      onChangeEditor(editor);
    }, []);
    return <div data-testid='notice-editor' />;
  },
}));
jest.mock('@/feature/editor/lib/emptyFormat', () => ({
  preserveEmptyParagraphs: (html) => html,
}));
jest.mock('@/feature/editor/lib/sanitize', () => ({
  sanitizeHtml: (html) => html,
}));
jest.mock('@/feature/event/component', () => ({
  EventForm: () => null,
  NoticeForm: jest.requireActual(
    '@/feature/event/component/NoticeForm/NoticeForm'
  ).default,
}));
jest.mock('@/apis', () => ({
  createThumbnail: jest.fn(),
  postEvent: jest.fn(),
  postPost: jest.fn(),
}));

function CurrentPath() {
  const { pathname } = useLocation();
  return <span data-testid='current-path'>{pathname}</span>;
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/board/event/event-post-write']}>
      <ModalContext.Provider
        value={{ modal: { id: null }, setModal: jest.fn() }}
      >
        <WriteEventPage />
        <CurrentPath />
      </ModalContext.Provider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  postPost.mockResolvedValue({
    status: 201,
    data: { result: { postId: 42 } },
  });
  createThumbnail.mockResolvedValue({ status: 200 });
});

test('공지사항 선택 시 같은 화면에 에디터와 하단 첨부 바를 표시하고 일반 게시글 API로 저장한다', async () => {
  renderPage();

  expect(screen.queryByLabelText('이미지 첨부')).not.toBeInTheDocument();
  fireEvent.click(screen.getByText('유형을 선택해주세요'));
  fireEvent.click(screen.getByText('공지사항'));
  expect(screen.getByTestId('current-path')).toHaveTextContent(
    '/board/event/event-post-write'
  );
  expect(screen.getByTestId('notice-editor')).toBeInTheDocument();
  expect(screen.getByLabelText('이미지 첨부')).toBeInTheDocument();

  fireEvent.click(
    screen.getByText('공지사항', { selector: '.categorySelectText' })
  );
  fireEvent.click(screen.getByText('영화'));
  expect(screen.queryByTestId('notice-editor')).not.toBeInTheDocument();
  expect(screen.queryByLabelText('이미지 첨부')).not.toBeInTheDocument();
  fireEvent.click(
    screen.getByText('영화', { selector: '.categorySelectText' })
  );
  fireEvent.click(screen.getByText('공지사항'));

  const firstImage = new File(['first'], '첫번째.png', { type: 'image/png' });
  const secondImage = new File(['second'], '두번째.png', { type: 'image/png' });
  fireEvent.change(screen.getByLabelText('이미지 첨부'), {
    target: { files: [firstImage, secondImage] },
  });
  fireEvent.click(screen.getByRole('button', { name: '첫번째.png 삭제' }));
  fireEvent.click(screen.getByRole('button', { name: '삭제 확인' }));
  expect(screen.getAllByRole('listitem')).toHaveLength(1);

  const transfer = {
    value: '',
    setData(_, value) {
      this.value = value;
    },
    getData() {
      return this.value;
    },
  };
  fireEvent.dragStart(screen.getByRole('listitem'), {
    dataTransfer: transfer,
  });
  fireEvent.drop(screen.getByTestId('trash'), { dataTransfer: transfer });
  fireEvent.click(screen.getByRole('button', { name: '삭제 확인' }));
  expect(screen.queryByRole('listitem')).not.toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText('제목을 입력해주세요'), {
    target: { value: '이벤트 공지' },
  });
  await waitFor(() =>
    expect(screen.getByRole('button', { name: '등록' })).toBeEnabled()
  );
  fireEvent.click(screen.getByRole('button', { name: '등록' }));

  await waitFor(() =>
    expect(postPost).toHaveBeenCalledWith(
      expect.objectContaining({
        boardId: 14,
        isNotice: true,
        title: '이벤트 공지',
        content: '<p>공지 본문</p>',
        attachmentsInfo: [],
      })
    )
  );
  expect(postEvent).not.toHaveBeenCalled();
  await waitFor(() =>
    expect(screen.getByTestId('current-path')).toHaveTextContent(
      '/board/event/notice'
    )
  );
});
