import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Dropdown,
  ErrorMessage,
  Icon,
  Label,
  NewButton,
  NumberInput,
  TextInput,
} from '@/shared/component';
import { MAJORS } from '@/shared/constant';

import {
  MarketingTermModal,
  NotiTermModal,
  PrivacyTermModal,
} from '@/feature/account/component/TermModal';
import {
  validateBirthday,
  validateNickname,
  validateStudentNumber,
} from '@/feature/account/lib';

import { useRegister } from '@/apis';

import styles from './UserInfoStep.module.css';

export default function UserInfoStep({ setFormData, formData }) {
  const navigate = useNavigate();
  const register = useRegister();

  const [isPrivacyTermsChecked, setIsPrivacyTermsChecked] = useState(false);
  const [isNotiTermsChecked, setIsNotiTermsChecked] = useState(false);
  const [isMarketingTermsChecked, setIsMarketingTermsChecked] = useState(false);

  const isFormValid =
    validateNickname(formData.nickname) === 'valid' &&
    validateStudentNumber(formData.studentNumber) === 'valid' &&
    validateBirthday(formData.birthday) === 'valid' &&
    formData.major &&
    isPrivacyTermsChecked;

  const inputList = [
    {
      type: 'text',
      label: '닉네임',
      id: 'nickname',
      placeholder: '닉네임을 입력해 주세요',
      value: formData.nickname,
      onChange: (next) =>
        setFormData((prev) => ({
          ...prev,
          nickname: next,
        })),
      validate: validateNickname,
      message: '특수문자 제외 2자 이상 20자 이하로 작성해 주세요',
    },
    {
      type: 'number',
      label: '학번',
      id: 'studentNumber',
      maxLength: 7,
      placeholder: '학번을 입력해 주세요',
      value: formData.studentNumber,
      onChange: (next) =>
        setFormData((prev) => ({
          ...prev,
          studentNumber: next,
        })),
      validate: validateStudentNumber,
      message: '학번은 7자리 숫자예요',
    },
    {
      type: 'dropdown',
      label: '전공',
      id: 'major',
      placeholder: '전공을 선택해주세요',
      options: MAJORS,
      select: { id: formData.major, name: formData.major },
      setFn: (_, option) => {
        setFormData((prev) => ({
          ...prev,
          major: option.name,
        }));
      },
      validate: (value) => (formData.major ? 'valid' : 'default'),
    },
    {
      type: 'text',
      label: '생년월일',
      id: 'birthday',
      placeholder: 'YYYY-MM-DD',
      value: formData.birthday,
      onChange: (next) => {
        const digits = next.replace(/\D/g, '').slice(0, 8);
        const formatted =
          digits.length <= 4
            ? digits
            : digits.length <= 6
              ? `${digits.slice(0, 4)}-${digits.slice(4)}`
              : `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
        setFormData((prev) => ({ ...prev, birthday: formatted }));
      },
      validate: validateBirthday,
      message: '입력 형식을 확인해 주세요',
    },
  ];

  return (
    <div className={styles.container}>
      <div>
        <p className={styles.title}>
          사용자 정보를
          <br />
          입력해 주세요
        </p>

        <div className={styles.inputList}>
          {inputList.map((props) => {
            const { validate } = props;

            const Input = {
              text: TextInput,
              number: NumberInput,
              dropdown: Dropdown,
            }[props.type];

            const status = validate?.(props.value);

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
      </div>
      <div className={styles.terms}>
        <CheckTerms
          id='privacyTerms'
          label={'개인정보 수집 및 이용 동의'}
          required
          navigate={navigate}
          isChecked={isPrivacyTermsChecked}
          setIsChecked={setIsPrivacyTermsChecked}
        />
        <CheckTerms
          id='notiTerms'
          label={'알림 수신 동의'}
          required={false}
          navigate={navigate}
          isChecked={isNotiTermsChecked}
          setIsChecked={setIsNotiTermsChecked}
        />
        <CheckTerms
          id='marketingTerms'
          label={'광고성 알림 수신 동의'}
          required={false}
          navigate={navigate}
          isChecked={isMarketingTermsChecked}
          setIsChecked={setIsMarketingTermsChecked}
        />
      </div>

      <div className={styles.submit}>
        <NewButton
          onClick={async () => await register(formData, navigate)}
          disabled={!isFormValid}
        >
          다음으로
        </NewButton>
      </div>
    </div>
  );
}

function CheckTerms({
  id = 'terms',
  label,
  isChecked = false,
  required = false,
  navigate,
  setIsChecked,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tagStyle = required ? styles.required : styles.optional;
  const tag = required ? '필수' : '선택';

  const handlePrivacyTermClick = () => {
    setIsModalOpen(true);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleModalAgree = () => {
    setIsChecked(true);
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.checkTerms}>
      <input
        id={id}
        className={styles.checkbox}
        type='checkbox'
        hidden
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <label htmlFor={id} className={styles.label}>
        <Icon
          className={`${styles.blueBox} ${isChecked ? styles.checked : ''}`}
          id='checkbox-blue'
          width={20}
          height={20}
        />
        <Icon
          className={`${styles.greyBox} ${!isChecked ? styles.unchecked : ''}`}
          id='checkbox-grey'
          width={20}
          height={20}
        />

        <span className={`${styles.tag} ${tagStyle}`}>{tag}</span>
        <p className={styles.checkboxLabel}>{label}</p>
      </label>

      <div className={styles.termsLink} onClick={handlePrivacyTermClick}>
        <Icon id='chevron-right' width={20} height={20} />
      </div>

      {isModalOpen && id === 'privacyTerms' && (
        <PrivacyTermModal
          onAgree={handleModalAgree}
          onClose={handleModalClose}
        />
      )}
      {isModalOpen && id === 'notiTerms' && (
        <NotiTermModal onAgree={handleModalAgree} onClose={handleModalClose} />
      )}
      {isModalOpen && id === 'marketingTerms' && (
        <MarketingTermModal
          onAgree={handleModalAgree}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
