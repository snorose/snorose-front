import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { IllustrationTaskFailed } from '@snorose/icons';

import { BackAppBar, Button } from '@/shared/component';

import styles from './SignUpFailurePage.module.css';

export default function SignUpFailurePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  useEffect(() => {
    if (!state) {
      navigate('/login');
    }
  }, [navigate, state]);

  return (
    <div className={styles.container}>
      <BackAppBar />

      <div className={styles.pageTopFrame}>
        <p className={styles.pageTitle}>회원가입 실패</p>
        <p className={styles.pageExplanation}>{state?.message}</p>
      </div>

      <div className={styles.pageMiddleFrame}>
        <IllustrationTaskFailed
          className={styles.illustration}
          role='img'
          aria-label='회원가입 실패를 알리는 일러스트'
        />
      </div>

      <div className={styles.pageBottomFrame}>
        <Link to='/signup'>
          <div className={styles.loginButton}>
            <Button btnName='뒤로가기' className='right' />
          </div>
        </Link>
      </div>
    </div>
  );
}
