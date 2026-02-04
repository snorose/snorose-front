import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFindId } from '@/apis';

import {
  FetchLoadingOverlay,
  Icon,
  BackAppBar,
  NumberInput,
  TextInput,
  Label,
  ErrorMessage,
  NewButton,
} from '@/shared/component';
import { LOADING_MESSAGE } from '@/shared/constant';

import { validateStudentNumber, validateUserName } from '@/feature/account/lib';

import styles from './FindIdPage.module.css';

export default function FindIdPage() {
  const findId = useFindId();
  const navigate = useNavigate();
  const [allowSubmit, setAllowSubmit] = useState(true);
  const [loading, setLoading] = useState();
  const [formData, setFormData] = useState({
    userName: '',
    studentNumber: '',
  });

  const inputProps = [
    {
      type: 'text',
      label: '이름',
      id: 'name',
      placeholder: '이름을 입력해주세요',
      value: formData.userName,
      onChange: (next) => setFormData((prev) => ({ ...prev, userName: next })),
      validate: validateUserName,
      message: '특수문자는 사용할 수 없습니다',
    },
    {
      type: 'number',
      label: '학번',
      id: 'studentNumber',
      placeholder: '학번을 입력해주세요',
      value: formData.studentNumber,
      onChange: (next) =>
        setFormData((prev) => ({ ...prev, studentNumber: next })),
      maxLength: 7,
      validate: validateStudentNumber,
      message: '학번 형식이 옳지 않습니다',
    },
  ];

  const isFormValid = inputProps.every(
    ({ validate, value }) => validate(value) === 'valid'
  );

  return (
    <div className={styles.container}>
      <BackAppBar />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isFormValid && allowSubmit) {
            findId(e, formData, navigate, setLoading);
            setAllowSubmit(false);
          }
        }}
      >
        <div className={styles.findIdFrame}>
          <div>
            <h1 className={styles.pageTitle}>아이디 찾기</h1>

            <div className={styles.form}>
              {inputProps.map((props) => {
                const Input = {
                  text: TextInput,
                  number: NumberInput,
                }[props.type];

                const { validate } = props;
                const status = validate(props.value);

                return (
                  <div key={`find-id-${props.id}`} className={styles.field}>
                    <Label htmlFor={props.id}>{props.label}</Label>
                    <Input status={status} {...props} />
                    {status === 'error' && (
                      <ErrorMessage>{props.message}</ErrorMessage>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={styles.alert}>
              <ol>
                <li>
                  아이디 찾기를 해도 입력한 정보와 일치하는 정보가 없다고 떠요.
                </li>
                <li>
                  마이페이지에서 학번이 ‘학번+숫자’형식이에요. 변경하고 싶어요.
                </li>
                <div className={`${styles.highlight} ${styles.alertArrow}`}>
                  → 구 스노로즈에 저장된 학번이 아래와 같은 경우,
                  <br /> 데이터 정합성을 위하여 임의로 '학번+숫자'로
                  수정되었어요.
                </div>
                <li>
                  가입 시 입력한 학번이 정확하지 않은 경우(ex 111111111111 등)
                </li>
                <li>다른 유저가 같은 학번으로 입학한 경우</li>
                <div className={`${styles.highlight} ${styles.alertArrow}`}>
                  → 하나의 학번 당 한 유저만 가입 가능하므로 리자가 임의로 다른
                  학번으로 변경했어요.
                </div>

                <div className={styles.highlight}>
                  따라서, 위의 경우에 해당하거나 학번이 잘못되어 수정이
                  필요하다면, 아래 구글 폼을 통해 학번 변경 문의를 남겨주시면
                  신속히 해결해드릴게요
                </div>
                <button className={styles.googleFormBtn}>
                  <Icon id='google-form' width={'1.6rem'} height={'1.6rem'} />
                  <a href='https://forms.gle/xwi7q47Dz59UNeEW7'>구글 폼</a>
                </button>
              </ol>
            </div>
          </div>

          <div className={styles.buttonFrame}>
            <NewButton disabled={!isFormValid}>다음으로</NewButton>
          </div>
        </div>
      </form>
      {loading && <FetchLoadingOverlay text={LOADING_MESSAGE.default} />}
    </div>
  );
}
