import { useToast } from '@/shared/hook';
import {
  EmailInput,
  ErrorMessage,
  Label,
  NewButton,
  PasswordInput,
  TextInput,
} from '@/shared/component';

import {
  validateUserName,
  validateSookmyungEmail,
  validateId,
  validatePassword,
} from '@/feature/account/lib';

import styles from './AccountInfoStep.module.css';

export default function AccountInfoStep({ formData, setFormData, setStage }) {
  const { toast } = useToast();

  const validateCheckedPassword = () => {
    if (formData.checkedPassword === '') return 'default';
    return formData.password === formData.checkedPassword ? 'valid' : 'error';
  };

  const inputList = [
    {
      type: 'text',
      label: '이름',
      id: 'userName',
      placeholder: '이름을 입력해 주세요',
      value: formData.userName,
      onChange: (next) =>
        setFormData((prev) => ({
          ...prev,
          userName: next,
        })),
      validate: validateUserName,
      message: '한글 또는 영어로 2자 이상 30자 이하로 입력해 주세요',
    },
    {
      type: 'email',
      label: '숙명 구글 이메일',
      id: 'email',
      placeholder: 'example@sookmyung.ac.kr',
      value: formData.email,
      onChange: (next) =>
        setFormData((prev) => ({
          ...prev,
          email: next,
        })),
      validate: validateSookmyungEmail,
      message: '숙명 이메일만 입력 가능해요',
    },
    {
      type: 'text',
      label: '아이디',
      id: 'loginId',
      placeholder: '사용할 아이디를 입력해주세요',
      value: formData.loginId,
      onChange: (next) =>
        setFormData((prev) => ({
          ...prev,
          loginId: next,
        })),
      validate: validateId,
      message: '특수문자를 제외한 5자 이상 30자 이하로 입력해 주세요',
    },
    {
      type: 'password',
      label: '비밀번호',
      id: 'password',
      placeholder: '비밀번호를 입력해 주세요',
      value: formData.password,
      onChange: (next) =>
        setFormData((prev) => ({
          ...prev,
          password: next,
        })),
      validate: validatePassword,
      message:
        '영어, 숫자, 특수문자(!@#%^&*)를 사용하여 8자 이상 16자 이하로 작성해 주세요',
    },
    {
      type: 'password',
      label: '비밀번호 확인',
      id: 'checkedPassword',
      placeholder: '비밀번호를 다시 입력해 주세요',
      value: formData.checkedPassword,
      onChange: (next) =>
        setFormData((prev) => ({
          ...prev,
          checkedPassword: next,
        })),
      validate: validateCheckedPassword,
      message: '비밀번호가 일치하지 않아요',
    },
  ];

  const isAllValid = inputList.every(
    (field) => field.validate(field.value) === 'valid'
  );

  const handleNext = () => {
    if (isAllValid) {
      setStage(2);
    } else {
      toast({
        message: '모든 필드를 올바르게 입력해주세요.',
        variant: 'error',
      });
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>
        계정 정보를
        <br /> 입력해 주세요
      </p>

      <div className={styles.inputList}>
        {inputList.map((props) => {
          const Input = {
            text: TextInput,
            email: EmailInput,
            password: PasswordInput,
          }[props.type];

          const { validate } = props;
          const status = validate(props.value);

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

      <NewButton onClick={handleNext} disabled={!isAllValid}>
        다음으로
      </NewButton>
    </div>
  );
}
