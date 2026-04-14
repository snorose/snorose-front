import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { BackAppBar, Button, NewButton } from '@/shared/component';

import { emailSendIllustration } from '@/assets/illustrations';

import styles from './FoundPwPage.module.css';

export default function FoundPwPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [email, setEmail] = useState('');

  useEffect(() => {
    try {
      setEmail(state.email);
    } catch (e) {
      navigate('/login');
    }
  }, []);

  return (
    <div className={styles.container}>
      <BackAppBar backNavTo='/login' />

      <div className={styles.pageTopFrame}>
        <p className={styles.pageTitle}>비밀번호 찾기</p>
        <p className={styles.pageSubtitle}>
          비밀번호 초기화 이메일이 발송되었어요
        </p>
        <p className={styles.pageExplanation}>
          이메일을 받지 못하셨다면
          <br />
          스팸함을 확인해주세요
        </p>
        <div className={styles.resultFrame}>
          <span className={`${styles.dot} ${styles.first}`}></span>
          <span className={`${styles.dot} ${styles.second}`}></span>
          <span className={`${styles.dot} ${styles.third}`}></span>
          <div className={styles.result}>
            <p>{email}</p>
          </div>
        </div>
      </div>
      <div className={styles.pageMiddleFrame}>
        <img
          src={emailSendIllustration}
          alt='이메일로 비밀번호를 전송했음을 알리는 일러스트'
          className={styles.illustration}
        />
      </div>
      <div className={styles.pageBottomFrame}>
        <NewButton onClick={() => navigate('/login')}>완료</NewButton>
        <NewButton
          onClick={() => navigate('/find-id')}
          variant='outlinedSecondary'
        >
          아이디를 잊어버렸어요
        </NewButton>
      </div>
    </div>
  );
}
