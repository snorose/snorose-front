import { useEffect, useState } from 'react';
import { ConfirmModal } from '@/shared/component';

const meta = {
  title: 'Component/ConfirmModal',
  component: ConfirmModal,
  parameters: {
    docs: {
      description: {
        component:
          '**ConfirmModal 컴포넌트**는 사용자에게 확인/취소 선택을 요구하는 모달 컴포넌트입니다.',
      },
    },
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '모달 표시 여부',
    },
    title: {
      control: 'text',
      description: '모달 제목',
    },
    message: {
      control: 'text',
      description: '모달 본문 메시지',
    },
    primaryButtonText: {
      control: 'text',
      description: '확인 버튼 텍스트',
    },
    secondaryButtonText: {
      control: 'text',
      description: '취소 버튼 텍스트',
    },
  },
};

export default meta;

const Template = (args) => {
  // 포털 대상 엘리먼트 생성
  useEffect(() => {
    const modalRoot = document.createElement('div');
    modalRoot.id = 'modal';
    document.body.appendChild(modalRoot);

    return () => {
      document.body.removeChild(modalRoot);
    };
  }, []);

  const [isOpen, setIsOpen] = useState(args.isOpen);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>모달 열기</button>
      <ConfirmModal
        {...args}
        isOpen={isOpen}
        onPrimaryButtonClick={() => {
          alert('확인 클릭됨');
          setIsOpen(false);
        }}
        onSecondaryButtonClick={() => {
          alert('취소 클릭됨');
          setIsOpen(false);
        }}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  isOpen: false,
  title: '정말 삭제하시겠습니까?',
  message: '삭제된 내용은 복구할 수 없습니다.',
  primaryButtonText: '삭제',
  secondaryButtonText: '취소',
};
