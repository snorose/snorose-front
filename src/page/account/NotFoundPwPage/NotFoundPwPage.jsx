import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { IllustrationTaskFailed } from '@snorose/icons';

import { BackAppBar, NewButton } from '@/shared/component';

import styles from './NotFoundPwPage.module.css';

export default function NotFoundPwPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!state) {
      navigate('/login');
    }
  }, [navigate, state]);

  return (
    <div className={styles.container}>
      <BackAppBar backNavTo='/login' />

      <div className={styles.pageTopFrame}>
        <p className={styles.pageTitle}>비밀번호 찾기</p>
        <p className={styles.pageExplanation}>
          입력하신 정보와 일치하는 정보가 없어요
        </p>
      </div>
      <div className={styles.pageMiddleFrame}>
        <IllustrationTaskFailed
          className={styles.illustration}
          role='img'
          aria-label='비밀번호 찾기 실패를 알리는 일러스트'
        />
      </div>
      <div className={styles.pageBottomFrame}>
        <NewButton variant='outlined' onClick={() => navigate('/find-pw')}>
          뒤로가기
        </NewButton>
        <NewButton onClick={() => navigate('/login')}>로그인하기</NewButton>
      </div>
    </div>
  );
}
