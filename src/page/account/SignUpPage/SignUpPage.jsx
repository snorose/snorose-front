import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { BackAppBar } from '@/shared/component';

import {
  StageDots,
  AccountInfoStep,
  AuthorizationStep,
  UserInfoStep,
} from '@/feature/account/component';

import styles from './SignUpPage.module.css';

export default function SignUpPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    checkedPassword: '',
    userName: '',
    email: '',
    nickname: '',
    studentNumber: '',
    major: '',
    birthday: '',
  });

  // URL에서 step 파라미터 읽기
  const getStepFromUrl = () => {
    const step = searchParams.get('step');
    const parsedStep = parseInt(step);
    return parsedStep >= 1 && parsedStep <= 3 ? parsedStep : 1;
  };

  const [stage, setStage] = useState(getStepFromUrl);

  // stage가 변경될 때 URL 업데이트 (단방향)
  useEffect(() => {
    const currentStep = searchParams.get('step');
    if (currentStep !== stage.toString()) {
      setSearchParams({ step: stage.toString() }, { replace: true });
    }
  }, [stage, searchParams, setSearchParams]);

  // URL이 직접 변경되었을 때만 stage 동기화
  useEffect(() => {
    const stepFromUrl = getStepFromUrl();
    if (stepFromUrl !== stage) {
      setStage(stepFromUrl);
    }
  }, [searchParams]);

  // 단계를 안전하게 변경하는 함수
  const handleStageChange = (newStage) => {
    if (newStage >= 1 && newStage <= 3 && newStage !== stage) {
      setStage(newStage);
    }
  };

  return (
    <div className={styles.container}>
      <BackAppBar notFixed />

      <div className={styles.stageDotsFrame}>
        <StageDots
          quantity={3}
          current={stage}
          width='5.4rem'
          size='1rem'
          gap='1.2rem'
        />
      </div>

      <div className={styles.signupFrame}>
        {stage === 1 ? (
          <AccountInfoStep
            setFormData={setFormData}
            formData={formData}
            setStage={handleStageChange}
          />
        ) : stage === 2 ? (
          <AuthorizationStep
            email={formData.email}
            setStage={handleStageChange}
          />
        ) : (
          <UserInfoStep
            setFormData={setFormData}
            formData={formData}
            setStage={handleStageChange}
          />
        )}
      </div>
    </div>
  );
}
