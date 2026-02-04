import { useState } from 'react';

import { verifySookmyungPortal } from '@/apis';

import { useToast } from '@/shared/hook';
import {
  EmailInput,
  ErrorMessage,
  FetchLoadingOverlay,
  Label,
  NewButton,
  NumberInput,
  PasswordInput,
} from '@/shared/component';

import { validateEmail, validateStudentNumber } from '@/feature/account/lib';

import styles from './VerifyStep.module.css';

export default function VerifyStep({ setStep }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    studentId: '',
    password: '',
    email: '',
  });
  const [loading, setLoading] = useState();

  const isAllValid =
    validateStudentNumber(formData.studentId) === 'valid' &&
    validateEmail(formData.email) === 'valid' &&
    formData.password;

  const verify = async () => {
    setLoading(true);

    try {
      await verifySookmyungPortal(formData);

      setStep('complete');
    } catch ({ response }) {
      toast({ message: response.data.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const inputList = [
    {
      type: 'number',
      label: '학번',
      id: 'studentId',
      maxLength: 7,
      placeholder: '학번을 입력해 주세요',
      value: formData.studentId,
      onChange: (next) =>
        setFormData((prev) => ({
          ...prev,
          studentId: next,
        })),
      validate: validateStudentNumber,
      message: '학번은 7자리 숫자예요',
    },
    {
      type: 'password',
      label: '숙명포털 비밀번호',
      id: 'password',
      placeholder: '닉네임을 입력해 주세요',
      value: formData.password,
      onChange: (next) =>
        setFormData((prev) => ({
          ...prev,
          password: next,
        })),
    },
    {
      type: 'email',
      label: '이메일',
      id: 'email',
      placeholder: 'YYYY-MM-DD',
      value: formData.email,
      onChange: (next) =>
        setFormData((prev) => ({
          ...prev,
          email: next,
        })),
      validate: validateEmail,
      message: '입력 형식을 확인해 주세요',
    },
  ];

  return (
    <section className={styles.container}>
      <div className={styles.inputList}>
        {inputList.map((props) => {
          const { validate } = props;

          const Input = {
            number: NumberInput,
            password: PasswordInput,
            email: EmailInput,
          }[props.type];

          const status = validate?.(props.value) ?? 'default';

          return (
            <div key={`signup-${props.id}`} className={styles.field}>
              <Label htmlFor={props.id}>{props.label}</Label>
              <Input status={status} {...props} />
              {status === 'error' && (
                <ErrorMessage>{props.message}</ErrorMessage>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.button}>
        <NewButton onClick={verify} disabled={!isAllValid}>
          인증
        </NewButton>
      </div>

      {loading && <FetchLoadingOverlay />}
    </section>
  );
}
