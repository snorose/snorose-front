import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

import {
  ActionButton,
  BackAppBar,
  ErrorMessage,
  Label,
  PasswordInput,
} from '@/shared/component';
import { MUTATION_KEY, TOAST } from '@/shared/constant';
import { useToast } from '@/shared/hook';

import { updatePassword } from '@/apis';

import styles from './ChangePwPage.module.css';

export default function ChangePwPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');

  const { mutate: updatePasswordMutate, isPending: isUpdatePasswordPending } =
    useMutation({
      mutationKey: [MUTATION_KEY.updatePassword],
      mutationFn: (body) => updatePassword(body),
      onSuccess: () => {
        toast({ message: TOAST.USER.editPassword, variant: 'success' });
        navigate('/my-page');
      },
      onError: ({ response }) => {
        toast({ message: response.data.message, variant: 'error' });
      },
    });

  const validatePasswordStrength = (password) => {
    const spaceRegex = /^\S*$/;
    const specialCharRegex = /[!@#%^&*]/;
    const emojiRegex = /[\uD83C-\uDBFF\uDC00-\uDFFF]+/g;

    return (
      password.length >= 8 &&
      password.length <= 16 &&
      spaceRegex.test(password) &&
      /[A-Za-z]/.test(password) &&
      /\d/.test(password) &&
      specialCharRegex.test(password) &&
      !emojiRegex.test(password)
    );
  };

  const validatePasswordMatch = (passwordCheck) => {
    return passwordCheck === newPassword;
  };

  const inputProps = [
    {
      id: 'current-pw',
      label: '현재 비밀번호',
      placeholder: '기존 비밀번호를 입력하세요',
      value: currentPassword,
      onChange: setCurrentPassword,
    },
    {
      id: 'new-pw',
      label: '새 비밀번호',
      placeholder: '새로운 비밀번호를 입력하세요',
      value: newPassword,
      onChange: setNewPassword,
      validate: validatePasswordStrength,
      errorMessage:
        '영어, 숫자, 특수문자(!@#%^&*)를 사용하여 8자 이상 16자 이하로 작성해주세요.',
    },
    {
      id: 'new-pw-check',
      label: '새 비밀번호 확인',
      placeholder: '새 비밀번호를 다시 입력하세요',
      value: newPasswordCheck,
      onChange: setNewPasswordCheck,
      validate: validatePasswordMatch,
      errorMessage: '비밀번호가 일치하지 않아요',
    },
  ];

  const isPasswordValid =
    validatePasswordStrength(newPassword) &&
    validatePasswordMatch(newPasswordCheck);

  return (
    <main className={styles.changePasswordPage}>
      <header className={styles.topContainer}>
        <p>
          <BackAppBar notFixed />
        </p>
        <div className={styles.submitBtn}>
          <ActionButton
            type='button'
            disabled={isUpdatePasswordPending || !isPasswordValid}
            onClick={() => {
              if (!isPasswordValid) {
                return;
              }

              updatePasswordMutate({
                currentPassword,
                newPassword,
              });
            }}
          >
            완료
          </ActionButton>
        </div>
      </header>

      <section className={styles.contentContainer}>
        <h1 className={styles.pageTitle}>비밀번호 변경</h1>
        <div className={styles.updatePasswordForm}>
          {inputProps.map((props) => {
            let status = 'default';

            if ('validate' in props) {
              status = props.validate(props.value) ? 'valid' : 'error';
            }

            if (props.value === '') {
              status = 'default';
            }

            return (
              <div key={`change-pw-${props.id}`} className={styles.field}>
                <Label htmlFor={props.id}>{props.label}</Label>
                <PasswordInput status={status} {...props} />
                {status === 'error' && (
                  <ErrorMessage>{props.errorMessage}</ErrorMessage>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
