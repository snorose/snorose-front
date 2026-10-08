import { useState } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AttachmentBar from './AttachmentBar';

const mockToast = jest.fn();
const MB = 1024 * 1024;

// 테스트 환경에서 아이콘 패키지를 불러올 수 없어,
// 테스트할 때만 실제 아이콘 대신 빈 SVG를 사용한다.
// 테스트는 아이콘 종류, DOM 유지 방식, CSS 값에 의존하지 않는다.
jest.mock(
  '@snorose/icons',
  () => {
    const Icon = (props) => <svg {...props} />;
    return Object.fromEntries(
      [
        'IconImage',
        'IconImageFill',
        'IconVideo',
        'IconVideoFill',
        'IconHashtag',
        'IconHashtagThick',
        'IconOpenEditor',
        'IconOpenEditorThick',
      ].map((name) => [name, Icon])
    );
  },
  { virtual: true }
);

jest.mock('@/shared/hook', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// 무관한 화면 의존성만 제외하고 첨부 처리와 검증은 실제 함수를 사용한다.
jest.mock('@/shared/constant', () => ({
  ...jest.requireActual('@/shared/constant/attachment'),
  ...jest.requireActual('@/shared/constant/toast'),
}));
jest.mock('@/feature/attachment/lib', () =>
  jest.requireActual('@/feature/attachment/lib/attachment')
);
jest.mock('@/feature/attachment/hook', () => ({
  ...jest.requireActual('@/feature/attachment/hook/attachment'),
  ...jest.requireActual('@/feature/attachment/hook/useAttachmentBarPosition'),
}));
jest.mock('@/feature/editor/component', () => ({
  FixedMenuEditor: () => null,
}));

function AttachmentBarFixture({ initialAttachments = [] }) {
  const [attachmentsInfo, setAttachmentsInfo] = useState(initialAttachments);

  return (
    <>
      <AttachmentBar
        attachmentsInfo={attachmentsInfo}
        setAttachmentsInfo={setAttachmentsInfo}
      />
      <ul aria-label='첨부 목록'>
        {attachmentsInfo.map((attachment, index) => (
          <li key={index}>{attachment.fileName}</li>
        ))}
      </ul>
    </>
  );
}

function createFile(name, type, size = 1024) {
  const file = new File(['sample'], name, { type });
  // 용량 검증에 필요한 파일 메타데이터만 지정해 큰 파일의 메모리 할당을 피한다.
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

function attachedNames() {
  return screen.queryAllByRole('listitem').map((item) => item.textContent);
}

function expectErrorNotice() {
  expect(mockToast).toHaveBeenCalledWith(
    expect.objectContaining({
      message: expect.any(String),
      variant: 'error',
    })
  );
}

beforeEach(() => {
  mockToast.mockClear();
});

describe('사진·동영상 첨부의 기본 동작', () => {
  it.each([
    ['이미지 첨부', 'photo.jpg', 'image/jpeg'],
    ['이미지 첨부', 'photo.png', 'image/png'],
    ['동영상 첨부', 'video.mp4', 'video/mp4'],
    ['동영상 첨부', 'video.mov', 'video/quicktime'],
  ])(
    '%s에서 %s 파일을 선택하면 첨부 목록에 추가한다',
    async (name, filename, type) => {
      render(<AttachmentBarFixture />);

      await userEvent.upload(
        screen.getByLabelText(name),
        createFile(filename, type)
      );

      expect(attachedNames()).toEqual([filename]);
      expect(mockToast).not.toHaveBeenCalled();
    }
  );

  it('사진 여러 장을 한 번에 선택하면 기존 첨부 뒤에 모두 추가한다', async () => {
    render(
      <AttachmentBarFixture
        initialAttachments={[{ fileName: 'existing.jpg', type: 'PHOTO' }]}
      />
    );

    await userEvent.upload(screen.getByLabelText('이미지 첨부'), [
      createFile('first.jpg', 'image/jpeg'),
      createFile('second.png', 'image/png'),
    ]);

    expect(attachedNames()).toEqual([
      'existing.jpg',
      'first.jpg',
      'second.png',
    ]);
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('여러 번 나누어 선택해도 앞서 첨부한 파일을 유지한다', async () => {
    render(<AttachmentBarFixture />);

    await userEvent.upload(
      screen.getByLabelText('이미지 첨부'),
      createFile('first.jpg', 'image/jpeg')
    );
    await userEvent.upload(
      screen.getByLabelText('이미지 첨부'),
      createFile('second.png', 'image/png')
    );
    await userEvent.upload(
      screen.getByLabelText('동영상 첨부'),
      createFile('video.mp4', 'video/mp4')
    );

    expect(attachedNames()).toEqual(['first.jpg', 'second.png', 'video.mp4']);
    expect(mockToast).not.toHaveBeenCalled();
  });

  it.each(['이미지 첨부', '동영상 첨부'])(
    '%s에서 파일 선택을 취소해도 기존 첨부를 유지한다',
    (name) => {
      render(
        <AttachmentBarFixture
          initialAttachments={[
            { fileName: 'photo.jpg', type: 'PHOTO' },
            { fileName: 'video.mp4', type: 'VIDEO' },
          ]}
        />
      );

      fireEvent.change(screen.getByLabelText(name), { target: { files: [] } });

      expect(attachedNames()).toEqual(['photo.jpg', 'video.mp4']);
      expect(mockToast).not.toHaveBeenCalled();
    }
  );

  it('같은 사진을 다시 선택해도 첨부할 수 있다', async () => {
    render(<AttachmentBarFixture />);
    const input = screen.getByLabelText('이미지 첨부');
    const file = createFile('photo.jpg', 'image/jpeg');

    // user-event 13에서 빠진 브라우저 동작을 보완한다.
    // 파일 입력값을 비우면 선택된 files도 비워지는 것이 실제 브라우저 동작이다.
    const emptySelection = input.files;
    const valueDescriptor = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    );
    Object.defineProperty(input, 'value', {
      configurable: true,
      get() {
        return valueDescriptor.get.call(this);
      },
      set(value) {
        valueDescriptor.set.call(this, value);
        if (this.value === '') {
          Object.defineProperty(this, 'files', {
            configurable: true,
            value: emptySelection,
          });
        }
      },
    });

    await userEvent.upload(screen.getByLabelText('이미지 첨부'), file);
    await userEvent.upload(screen.getByLabelText('이미지 첨부'), file);

    expect(attachedNames()).toEqual(['photo.jpg', 'photo.jpg']);
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('키보드로 사진과 동영상 첨부 입력칸에 접근할 수 있다', () => {
    render(<AttachmentBarFixture />);

    userEvent.tab();
    expect(screen.getByLabelText('이미지 첨부')).toHaveFocus();
    userEvent.tab();
    expect(screen.getByLabelText('동영상 첨부')).toHaveFocus();
  });
});

describe('현재 서비스의 첨부 정책', () => {
  it.each([
    ['이미지 첨부', 'photo.jpg', 'video/mp4'],
    ['동영상 첨부', 'video.mp4', 'image/jpeg'],
  ])(
    '%s에서 실제 형식이 맞지 않는 파일을 거부한다',
    async (name, filename, type) => {
      render(
        <AttachmentBarFixture
          initialAttachments={[{ fileName: 'existing.jpg', type: 'PHOTO' }]}
        />
      );

      await userEvent.upload(
        screen.getByLabelText(name),
        createFile(filename, type)
      );

      expect(attachedNames()).toEqual(['existing.jpg']);
      expectErrorNotice();
    }
  );

  it.each([
    ['이미지 첨부', 'photo.jpg', 'image/jpeg', 7 * MB],
    ['동영상 첨부', 'video.mp4', 'video/mp4', 50 * MB],
  ])(
    '%s에서 최대 허용 용량까지 첨부할 수 있다',
    async (name, filename, type, size) => {
      render(<AttachmentBarFixture />);

      await userEvent.upload(
        screen.getByLabelText(name),
        createFile(filename, type, size)
      );

      expect(attachedNames()).toEqual([filename]);
      expect(mockToast).not.toHaveBeenCalled();
    }
  );

  it.each([
    ['이미지 첨부', 'photo.jpg', 'image/jpeg', 7 * MB + 1],
    ['동영상 첨부', 'video.mp4', 'video/mp4', 50 * MB + 1],
  ])(
    '%s에서 최대 용량을 1바이트라도 초과하면 첨부하지 않는다',
    async (name, filename, type, size) => {
      render(<AttachmentBarFixture />);

      await userEvent.upload(
        screen.getByLabelText(name),
        createFile(filename, type, size)
      );

      expect(attachedNames()).toEqual([]);
      expectErrorNotice();
    }
  );

  it('사진 선택에 용량 초과 파일이 섞여 있으면 정상 파일만 추가하고 알린다', async () => {
    render(<AttachmentBarFixture />);

    await userEvent.upload(screen.getByLabelText('이미지 첨부'), [
      createFile('normal.jpg', 'image/jpeg'),
      createFile('too-large.jpg', 'image/jpeg', 7 * MB + 1),
    ]);

    expect(attachedNames()).toEqual(['normal.jpg']);
    expectErrorNotice();
  });

  it('사진은 최대 5장까지 첨부할 수 있다', async () => {
    render(<AttachmentBarFixture />);
    const files = Array.from({ length: 5 }, (_, index) =>
      createFile('photo-' + index + '.jpg', 'image/jpeg')
    );

    await userEvent.upload(screen.getByLabelText('이미지 첨부'), files);

    expect(attachedNames()).toEqual(files.map((file) => file.name));
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('기존 사진을 포함해 5장을 초과하면 새 선택을 거부하고 기존 파일을 유지한다', async () => {
    const existing = Array.from({ length: 4 }, (_, index) => ({
      fileName: 'existing-' + index + '.jpg',
      type: 'PHOTO',
    }));
    render(<AttachmentBarFixture initialAttachments={existing} />);

    await userEvent.upload(screen.getByLabelText('이미지 첨부'), [
      createFile('first.jpg', 'image/jpeg'),
      createFile('second.jpg', 'image/jpeg'),
    ]);

    expect(attachedNames()).toEqual(existing.map((file) => file.fileName));
    expectErrorNotice();
  });

  it('동영상 2개를 한 번에 선택하면 첨부하지 않는다', async () => {
    render(<AttachmentBarFixture />);

    await userEvent.upload(screen.getByLabelText('동영상 첨부'), [
      createFile('first.mp4', 'video/mp4'),
      createFile('second.mp4', 'video/mp4'),
    ]);

    expect(attachedNames()).toEqual([]);
    expectErrorNotice();
  });

  it('동영상이 이미 있으면 추가 동영상을 거부하고 기존 파일을 유지한다', async () => {
    render(
      <AttachmentBarFixture
        initialAttachments={[{ fileName: 'existing.mp4', type: 'VIDEO' }]}
      />
    );

    await userEvent.upload(
      screen.getByLabelText('동영상 첨부'),
      createFile('new.mp4', 'video/mp4')
    );

    expect(attachedNames()).toEqual(['existing.mp4']);
    expectErrorNotice();
  });

  it('사진 5장과 동영상 1개는 각각의 제한 안에서 함께 첨부할 수 있다', async () => {
    const photos = Array.from({ length: 5 }, (_, index) => ({
      fileName: 'photo-' + index + '.jpg',
      type: 'PHOTO',
    }));
    render(<AttachmentBarFixture initialAttachments={photos} />);

    await userEvent.upload(
      screen.getByLabelText('동영상 첨부'),
      createFile('video.mp4', 'video/mp4')
    );

    expect(attachedNames()).toEqual([
      ...photos.map((photo) => photo.fileName),
      'video.mp4',
    ]);
    expect(mockToast).not.toHaveBeenCalled();
  });
});
