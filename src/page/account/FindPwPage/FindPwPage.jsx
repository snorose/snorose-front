import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFindPw } from '@/apis';

import {
  BackAppBar,
  EmailInput,
  ErrorMessage,
  FetchLoadingOverlay,
  Icon,
  Label,
  NewButton,
  TextInput,
} from '@/shared/component';
import { LOADING_MESSAGE } from '@/shared/constant';

import { validateEmail, validateId } from '@/feature/account/lib';

import styles from './FindPwPage.module.css';

export default function FindPwPage() {
  const findPw = useFindPw();
  const navigate = useNavigate();

  const [allowSubmit, setAllowSubmit] = useState(true);
  const [loading, setLoading] = useState();
  const [formData, setFormData] = useState({
    loginId: '',
    email: '',
  });

  const inputProps = [
    {
      type: 'text',
      label: '아이디',
      id: 'loginId',
      placeholder: '아이디를 입력해주세요',
      value: formData.loginId,
      onChange: (next) => setFormData((prev) => ({ ...prev, loginId: next })),
      validate: validateId,
      message: '아이디는 영어, 숫자만 가능합니다',
    },
    {
      type: 'email',
      label: '이메일',
      id: 'email',
      placeholder: '이메일을 입력해주세요',
      value: formData.email,
      onChange: (next) => setFormData((prev) => ({ ...prev, email: next })),
      validate: validateEmail,
      message: '이메일만 입력 가능합니다',
    },
  ];

  const isFormValid = inputProps.every(
    ({ validate, value }) => validate(value) === 'valid'
  );

  return (
    <div className={styles.container}>
      <BackAppBar />

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          if (isFormValid && allowSubmit) {
            findPw(e, formData, navigate, setLoading);
            setAllowSubmit(false);
          }
        }}
      >
        <div className={styles.findIdFrame}>
          <div>
            <h1 className={styles.pageTitle}>비밀번호 찾기</h1>

            <div className={styles.form}>
              {inputProps.map((props) => {
                const Input = {
                  text: TextInput,
                  email: EmailInput,
                }[props.type];

                const { validate } = props;
                const status = validate(props.value);

                return (
                  <div key={`find-pw-${props.id}`} className={styles.field}>
                    <Label>{props.label}</Label>
                    <Input status={status} {...props} />
                    {status === 'error' && (
                      <ErrorMessage>{props.message}</ErrorMessage>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={styles.alert}>
              <ul>
                <li>
                  기존 이메일을 알 수 없는 경우,
                  <span className={styles.highlight}> 아이디 찾기</span> 기능을
                  통해 확인할 수 있어요
                </li>
                <li>
                  <span className={styles.highlight}>아이디 찾기</span>에서
                  이름과 학번을 입력하면,
                  <br />
                  <span className={styles.highlight}>
                    다음 이메일로 아이디가 발송되었어요
                  </span>
                  라는 안내를 통해 이메일 주소를 확인할 수 있어요
                </li>
              </ul>
              <p className={styles.highlight} style={{ marginTop: '1.3rem' }}>
                만약 이메일이 존재하지 않거나 유효하지 않을 경우,
                <br />
                아래 구글 폼을 작성해주시면 신속히 해결해드릴게요.
              </p>
              <button className={styles.googleFormBtn}>
                <Icon id='google-form' width={'1.6rem'} height={'1.6rem'} />
                <a href='https://forms.gle/PDmKuPUuUzKXTh8BA'>구글 폼</a>
              </button>
            </div>
          </div>

          <div className={styles.buttonFrame}>
            <NewButton disabled={!isFormValid}>완료</NewButton>
            <NewButton
              variant='outlinedSecondary'
              onClick={() => navigate('/find-id')}
            >
              아이디를 잊어버렸어요
            </NewButton>
          </div>
        </div>
      </form>

      {loading && <FetchLoadingOverlay text={LOADING_MESSAGE.default} />}
    </div>
  );
}
