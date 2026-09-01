import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  BackAppBar,
  Icon,
  NewButton,
  PasswordInput,
  TextInput,
} from '@/shared/component';
import { TOAST } from '@/shared/constant';
import { useToast } from '@/shared/hook';

import { useLogin } from '@/feature/auth/hooks';

import snoroseLogo from '@/assets/images/snoroseLogo.svg';

import styles from './LoginPage.module.css';

const LOGIN_ERROR_MAP = {
  '아이디 또는 비밀번호가 틀립니다.': '아이디 혹은 비밀번호가 일치하지 않아요',
};

export default function Login() {
  const location = useLocation();
  const redirectTo = getRedirectPath(location.state);

  const [formData, setFormData] = useState({ loginId: '', password: '' });
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRememberId, setIsRememberId] = useState(false);

  const { toast } = useToast();
  const { mutate: login } = useLogin({
    redirectTo,
    onError: (error) => {
      const status = error.response?.status;
      const serverMsg =
        error.response?.data?.message || '네트워크 연결 상태를 확인해주세요.';

      if (status === 500) {
        toast({ message: TOAST.ERROR.SERVER, variant: 'error' });
      } else {
        setErrorMessage(LOGIN_ERROR_MAP[serverMsg] ?? serverMsg);
      }

      setIsError(true);
    },
  });

  useEffect(() => {
    const savedId = localStorage.getItem('rememberedLoginId');

    if (savedId) {
      setFormData((prev) => ({ ...prev, loginId: savedId }));
      setIsRememberId(true);
    }
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (!formData.loginId) {
      toast({ message: TOAST.LOGIN.emptyId, variant: 'info' });
      return;
    }

    if (!formData.password) {
      toast({ message: TOAST.LOGIN.emptyPw, variant: 'info' });
      return;
    }

    if (isRememberId) {
      localStorage.setItem('rememberedLoginId', formData.loginId);
    } else {
      localStorage.removeItem('rememberedLoginId');
    }

    login(formData);
  };

  const inputProps = [
    {
      type: 'text',
      id: 'loginId',
      placeholder: '아이디',
      value: formData.loginId,
      onChange: (next) => setFormData((prev) => ({ ...prev, loginId: next })),
    },
    {
      type: 'password',
      id: 'password',
      placeholder: '영어, 숫자, 특수문자를 포함한 비밀번호',
      value: formData.password,
      onChange: (next) => setFormData((prev) => ({ ...prev, password: next })),
    },
  ];

  return (
    <div className={styles.container}>
      <BackAppBar />

      <form onSubmit={handleLoginSubmit}>
        <img src={snoroseLogo} alt='스노로즈 로고' className={styles.logo} />

        <p className={styles.title}>
          숙명인을 위한 커뮤니티,
          <br />
          스노로즈에 오신 것을 환영합니다!
        </p>

        <div className={styles.form}>
          {inputProps.map((props) => {
            const Input = {
              text: TextInput,
              password: PasswordInput,
            }[props.type];

            let status = isError ? 'error' : 'default';
            status = props.value === '' ? 'default' : status;
            return <Input status={status} {...props} />;
          })}
        </div>

        {errorMessage && (
          <p role='alert' className={styles.errorMessage}>
            {errorMessage}
          </p>
        )}

        <div
          className={styles.rememberIdCheckbox}
          onClick={() => setIsRememberId((prev) => !prev)}
        >
          <Icon
            id={isRememberId ? 'inactive-check-circle' : 'active-check-circle'}
            width={22}
            height={22}
          />
          <span>아이디 기억하기</span>
        </div>

        <NewButton>로그인하기</NewButton>

        <div className={styles.find}>
          <Link to='/signup'>회원가입하기</Link>
          <p className={styles.divider}>|</p>
          <Link to='/find-id'>아이디 찾기</Link>
          <p className={styles.divider}>|</p>
          <Link to='/find-pw'>비밀번호 찾기</Link>
        </div>
      </form>
    </div>
  );
}

function getRedirectPath(state) {
  const from = state?.from;
  const pathname = from?.pathname;

  if (
    typeof pathname !== 'string' ||
    !pathname.startsWith('/') ||
    pathname.startsWith('//') ||
    pathname === '/login'
  ) {
    return '/';
  }

  const search = typeof from.search === 'string' ? from.search : '';
  const hash = typeof from.hash === 'string' ? from.hash : '';

  return `${pathname}${search}${hash}`;
}
