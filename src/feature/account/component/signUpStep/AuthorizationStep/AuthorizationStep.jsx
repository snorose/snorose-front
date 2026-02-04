import { useState, useEffect } from 'react';

import { useSendUser, useCertifyUser } from '@/apis';

import { useToast } from '@/shared/hook';
import { Label, TextInput, NewButton } from '@/shared/component';

import styles from './AuthorizationStep.module.css';

export default function AuthorizationStep({ email, setStage }) {
  const sendUser = useSendUser();
  const certifyUser = useCertifyUser();
  const { toast } = useToast();
  const [authNum, setAuthNum] = useState('');

  useEffect(() => {
    sendUser(email);
  }, [email]);

  // 인증 처리 함수
  const handleVerification = async () => {
    try {
      const res = await certifyUser({
        email,
        authNum,
      });

      if (res) {
        setStage(3); // 직접 3단계로 설정
      } else {
        toast({ message: '코드를 다시 한 번 확인해 주세요', variant: 'error' });
      }
    } catch (error) {
      toast({ message: '코드를 다시 한 번 확인해 주세요', variant: 'error' });
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <p className={styles.title}>
          이메일 인증을 <br />
          완료해 주세요
        </p>
        <p className={styles.text}>
          숙명 구글 이메일로 확인 코드를 보내드렸어요
        </p>

        <div>
          <Label htmlFor='authNum'>확인 코드</Label>
          <TextInput
            id='authNum'
            placeholder='확인 코드를 입력해 주세요'
            value={authNum}
            onChange={(next) => setAuthNum(next)}
          />
        </div>
      </div>

      <NewButton onClick={handleVerification} disabled={authNum === ''}>
        다음으로
      </NewButton>
    </div>
  );
}
