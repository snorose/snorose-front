import { Icon } from '@/shared/component';
import styles from './Toast.module.css';

const toastStoryConfig = {
  title: 'Component/Toast',
  parameters: {
    docs: {
      description: {
        component:
          'Toast 컴포넌트는 사용자에게 짧은 알림 메시지를 표시하는 컴포넌트입니다.<br />' +
          '`createPortal`을 사용하여 `toast` id를 가진 DOM에 렌더링되며, 3.5초 후 자동으로 사라집니다.<br />' +
          '`variant` prop으로 `info`, `success`, `error` 세 가지 스타일을 지원합니다.<br /><br />' +
          '**Variant 타입:**<br />' +
          '- `info` (기본값): 파란색 배경<br />' +
          '- `success`: 초록색 배경<br />' +
          '- `error`: 핑크색 배경',
      },
    },
  },
  argTypes: {
    message: {
      description: '표시할 메시지',
      control: 'text',
    },
    variant: {
      description: '토스트 스타일 타입 (info | success | error)',
      control: { type: 'select' },
      options: ['info', 'success', 'error'],
    },
  },
};
export default toastStoryConfig;

const toastConfig = {
  error: {
    icon: 'info-triangle',
    className: styles.error,
  },
  info: {
    icon: 'info-circle',
    className: styles.info,
  },
  success: {
    icon: 'active-check-circle-outline',
    className: styles.success,
  },
};

const Template = ({ message, variant = 'info' }) => {
  const config = toastConfig[variant] || toastConfig.info;
  const toastClassName = `${styles.toast} ${config.className || ''}`;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div className={toastClassName}>
        <Icon className={styles.icon} id={config.icon} width={21} height={20} />
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
};

export const Info = Template.bind({});
Info.args = {
  message: '정보 메시지입니다',
  variant: 'info',
};

export const Success = Template.bind({});
Success.args = {
  message: '성공적으로 완료되었습니다',
  variant: 'success',
};

export const Error = Template.bind({});
Error.args = {
  message: '오류가 발생했습니다',
  variant: 'error',
};
