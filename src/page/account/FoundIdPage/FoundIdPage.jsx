import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { BackAppBar, NewButton } from '@/shared/component';

import styles from './FoundIdPage.module.css';

import { emailSendIllustration } from '@/assets/illustrations';

export default function FoundIdPage() {
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
        <p className={styles.pageTitle}>아이디 찾기</p>
        <p className={styles.pageExplanation}>
          다음 이메일로 아이디가 발송되었어요
        </p>
        <p className={styles.pageSubExplanation}>
          이메일을 받지 못하셨다면
          <br />
          스팸함을 확인해주세요
        </p>
        <div className={styles.resultFrame}>
          <span className={`${styles.dot} ${styles.first}`}></span>
          <span className={`${styles.dot} ${styles.second}`}></span>
          <span className={`${styles.dot} ${styles.third}`}></span>
        </div>
        <p className={styles.result}>{email}</p>
      </div>
      <div className={styles.pageMiddleFrame}>
        <img
          src={emailSendIllustration}
          alt='이메일로 아이디를 전송했음을 알리는 일러스트'
          className={styles.illustration}
        />
      </div>
      <div className={styles.pageBottomFrame}>
        <NewButton onClick={() => navigate('/login')}>로그인하기</NewButton>
        <NewButton
          onClick={() => navigate('/find-pw')}
          variant='outlinedSecondary'
        >
          비밀번호를 잊어버렸어요
        </NewButton>
      </div>
    </div>
  );
}
