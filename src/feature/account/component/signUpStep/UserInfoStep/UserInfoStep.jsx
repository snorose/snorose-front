import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRegister } from '@/apis';

import {
  Button,
  Dropdown,
  Icon,
  Label,
  TextInput,
  ErrorMessage,
  NumberInput,
  NewButton,
} from '@/shared/component';
import { MAJORS } from '@/shared/constant';

import {
  validateNickname,
  validateStudentNumber,
  validateBirthday,
} from '@/feature/account/lib';
import { PRIVACY_TERM } from '@/feature/account/constant/privacyTerm';

import styles from './UserInfoStep.module.css';

export default function UserInfoStep({ setFormData, formData }) {
  const navigate = useNavigate();
  const register = useRegister();

  const [isTermsChecked, setIsTermsChecked] = useState(false);

  const isFormValid =
    validateNickname(formData.nickname) === 'valid' &&
    validateStudentNumber(formData.studentNumber) === 'valid' &&
    validateBirthday(formData.birthday) === 'valid' &&
    formData.major &&
    isTermsChecked;

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
      type: 'text',
      label: '생년월일',
      id: 'birthday',
      placeholder: 'YYYY-MM-DD',
      value: formData.birthday,
      onChange: (next) =>
        setFormData((prev) => ({
          ...prev,
          birthday: next,
        })),
      validate: validateBirthday,
      message: '입력 형식을 확인해 주세요',
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

      <CheckTerms
        label={'개인정보 수집 및 이용 동의'}
        required
        navigate={navigate}
        isChecked={isTermsChecked}
        setIsChecked={setIsTermsChecked}
      />

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
        id='terms'
        className={styles.checkbox}
        type='checkbox'
        hidden
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <label htmlFor='terms' className={styles.label}>
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

      {isModalOpen && (
        <PrivacyTermModal
          onAgree={handleModalAgree}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

function PrivacyTermModal({ onAgree, onClose }) {
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const descriptionRef = useRef(null);

  const handleScroll = (e) => {
    // 이미 한 번 끝까지 스크롤했다면 더 이상 확인하지 않음
    if (hasScrolledToEnd) return;

    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // 스크롤이 끝에 도달했는지 확인 (약간의 여유값 추가)
    const isAtEnd = scrollTop + clientHeight >= scrollHeight - 5;

    if (isAtEnd) {
      setHasScrolledToEnd(true);
    }
  };

  // 컨텐츠가 스크롤 없이도 모두 보이는 경우 처리
  useEffect(() => {
    if (descriptionRef.current) {
      const { scrollHeight, clientHeight } = descriptionRef.current;
      if (scrollHeight <= clientHeight) {
        setHasScrolledToEnd(true);
      }
    }
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {PRIVACY_TERM.title}
            <span className={styles.modalRequired}>*</span>
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <Icon id='x' width={24} height={24} />
          </button>
        </div>

        <div
          className={styles.modalContent}
          ref={descriptionRef}
          onScroll={handleScroll}
        >
          <div className={styles.modalSummary}>{PRIVACY_TERM.summary}</div>
          <div className={styles.modalGuide}>{PRIVACY_TERM.guide}</div>
          {PRIVACY_TERM.details.map((section, idx) => (
            <div key={idx} className={styles.modalDetails}>
              <div className={styles.modalSubtitle}>{section.title}</div>
              <div className={styles.modalText}>{section.content}</div>
            </div>
          ))}
          <div className={styles.modalNotice}>{PRIVACY_TERM.notice}</div>
        </div>

        <div className={styles.modalFooter}>
          <Button
            btnName='동의하고 계속하기'
            className={hasScrolledToEnd ? 'right' : 'ready'}
            disabled={!hasScrolledToEnd}
            onClick={onAgree}
          />
        </div>
      </div>
    </div>
  );
}
