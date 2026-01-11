import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/shared/hook';
import { ActionButton, BackAppBar, PwInput } from '@/shared/component';
import { MUTATION_KEY, TOAST } from '@/shared/constant';

import { updatePassword } from '@/apis';

import styles from './ChangePwPage.module.css';

export default function ChangePwPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [newPasswordCheckError, setNewPasswordCheckError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

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

    if (
      password.length < 8 ||
      !spaceRegex.test(password) ||
      !/[A-Za-z]/.test(password) ||
      !/\d/.test(password) ||
      !specialCharRegex.test(password) ||
      emojiRegex.test(password)
    ) {
      setNewPasswordError(
        '영어, 숫자, 특수문자(!@#%^&*)를 사용하여 8자 이상 16자 이하로 작성해주세요.'
      );
      setIsPasswordValid(false);
    } else {
      setNewPasswordError('');
      setIsPasswordValid(true);
    }
  };

  const validatePasswordMatch = (passwordCheck, password) => {
    if (passwordCheck !== password) {
      setNewPasswordCheckError('비밀번호가 일치하지 않아요');
    } else {
      setNewPasswordCheckError('');
    }
  };

  const handleSubmitButtonClick = () => {
    if (newPassword !== newPasswordCheck) {
      return;
    }

    updatePasswordMutate({
      currentPassword,
      newPassword,
    });
  };

  const handleCurrentPasswordInputChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordInputChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordInputChange = (e) => {
    setNewPasswordCheck(e.target.value);
  };

  useEffect(() => {
    if (newPassword) {
      validatePasswordStrength(newPassword);
    } else {
      setNewPasswordError('');
      setIsPasswordValid(false);
    }
  }, [newPassword]);

  useEffect(() => {
    if (newPasswordCheck) {
      validatePasswordMatch(newPasswordCheck, newPassword);
    } else {
      setNewPasswordCheckError('');
    }
  }, [newPasswordCheck, newPassword]);

  return (
    <main className={styles.changePasswordPage}>
      <header className={styles.topContainer}>
        <p>
          <BackAppBar notFixed />
        </p>
        <div className={styles.submitBtn}>
          <ActionButton
            type='button'
            disabled={
              isUpdatePasswordPending ||
              newPassword !== newPasswordCheck ||
              !isPasswordValid
            }
            onClick={handleSubmitButtonClick}
          >
            완료
          </ActionButton>
        </div>
      </header>

      <section className={styles.contentContainer}>
        <h1 className={styles.pageTitle}>비밀번호 변경</h1>
        <div className={styles.updatePasswordForm}>
          <PwInput
            title='현재 비밀번호'
            placeholder='기존 비밀번호를 입력하세요'
            value={currentPassword}
            isStatic
            onChange={handleCurrentPasswordInputChange}
          />

          <PwInput
            title='새 비밀번호'
            placeholder='새로운 비밀번호를 입력하세요'
            value={newPassword}
            errorMessage={newPasswordError}
            onChange={handleNewPasswordInputChange}
          />

          <PwInput
            title='새 비밀번호 확인'
            placeholder='새 비밀번호를 다시 입력하세요'
            value={newPasswordCheck}
            errorMessage={newPasswordCheckError}
            onChange={handleConfirmNewPasswordInputChange}
          />
        </div>
      </section>
    </main>
  );
}
