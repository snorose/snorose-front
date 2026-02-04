import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useLogin } from '@/apis';

import {
  BackAppBar,
  Icon,
  NewButton,
  PasswordInput,
  TextInput,
} from '@/shared/component';

import snoroseLogo from '@/assets/images/snoroseLogo.svg';

import styles from './LoginPage.module.css';

export default function Login() {
  const navigate = useNavigate();
  const login = useLogin();
  const [formData, setFormData] = useState({ loginId: '', password: '' });
  const [isError, setIsError] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  const toggleRememberId = () => {
    setIsChecked((prev) => !prev);
  };

  const handleLoginSubmit = (e) => {
    if (isChecked) {
      localStorage.setItem('rememberedLoginId', formData.loginId);
    } else {
      localStorage.removeItem('rememberedLoginId');
    }

    login(e, setIsError, formData, navigate);
  };

  useEffect(() => {
    const savedId = localStorage.getItem('rememberedLoginId');

    if (savedId) {
      setFormData((prev) => ({ ...prev, loginId: savedId }));
      setIsChecked(true);
    }
  }, []);

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

        <div className={styles.rememberIdCheckbox} onClick={toggleRememberId}>
          <Icon
            id={isChecked ? 'inactive-check-circle' : 'active-check-circle'}
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
