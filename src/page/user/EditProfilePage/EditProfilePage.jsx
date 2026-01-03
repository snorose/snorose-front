import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateUserInfo } from '@/apis';

import { useAuth, useToast } from '@/shared/hook';
import {
  ActionButton,
  BackAppBar,
  CategoryFieldset,
  Dropdown,
} from '@/shared/component';
import {
  MAJORS,
  MUTATION_KEY,
  QUERY_KEY,
  PRIVATE_USER_INFO_UPDATE_PERMISSION_ROLE_ID_LIST,
  TOAST,
} from '@/shared/constant';

import defaultProfile from '@/assets/images/defaultProfile.svg';

import styles from './EditProfilePage.module.css';

const VALIDATIONS = Object.freeze({
  NAME: /^[a-zA-Z가-힣\s]*$/,
  NICKNAME: /^[a-zA-Z가-힣ㄱ-ㅎ0-9]*$/,
  SPECIAL_CHAR: /[!@#\$%\^\&*\)\(+=._-]/,
  EMOJI: /[\uD83C-\uDBFF\uDC00-\uDFFF]+/g,
});

export default function EditProfilePage() {
  const { userInfo, status } = useAuth({
    isRequiredAuth: true,
  });

  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [major, setMajor] = useState({});
  const [nameError, setNameError] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthDateError, setBirthDateError] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { mutate: updateUserInfoMutate, isPending: isUpdateUserInfoPending } =
    useMutation({
      mutationKey: [MUTATION_KEY.updateUserInfo],
      mutationFn: (body) => updateUserInfo(body),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.userInfo],
        });

        toast({ message: TOAST.USER.editUserInfo, variant: 'success' });
        navigate('/my-page');
      },
      onError: ({ response }) => {
        const { data } = response;

        toast(
          // data.userProfile ||
          {
            message:
              data.userName ||
              data.birthday ||
              data.nickname ||
              data.major ||
              data.message,
            variant: 'error',
          }
        );
      },
    });

  const disabledPrivateUserInfoInput = useMemo(() => {
    if (userInfo === undefined) {
      return true;
    }

    return !PRIVATE_USER_INFO_UPDATE_PERMISSION_ROLE_ID_LIST.includes(
      userInfo.userRoleId
    );
  }, [userInfo]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);

    if (
      !VALIDATIONS.NAME.test(value) ||
      value.length < 2 ||
      value.length > 10 ||
      VALIDATIONS.SPECIAL_CHAR.test(value) ||
      VALIDATIONS.EMOJI.test(value)
    ) {
      setNameError(
        '영어 대소문자, 한글만 가능하며, 2자 이상 10자 이하로 작성해주세요.'
      );
    } else {
      setNameError('');
    }
  };

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    setNickname(value);

    if (
      !VALIDATIONS.NICKNAME.test(value) ||
      value.length < 2 ||
      value.length > 30 ||
      VALIDATIONS.SPECIAL_CHAR.test(value) ||
      VALIDATIONS.EMOJI.test(value)
    ) {
      setNicknameError(
        '특수문자, 띄어쓰기를 제외한 2자 이상 30자 이하로 작성해주세요'
      );
    } else {
      setNicknameError('');
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleBirthDateChange = (e) => {
    const input = e.target;
    let value = input.value.replace(/[^0-9]/g, '');

    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    input.value = value;

    if (value.length === 8) {
      const year = parseInt(value.slice(0, 4), 10);
      const month = parseInt(value.slice(4, 6), 10);
      const day = parseInt(value.slice(6, 8), 10);

      const date = new Date(year, month - 1, day);
      if (
        date.getFullYear() !== year ||
        date.getMonth() + 1 !== month ||
        date.getDate() !== day
      ) {
        setBirthDateError('유효하지 않은 생년월일입니다.');
      } else {
        setBirthDateError('');
      }
    } else if (value.length > 0 && value.length < 8) {
      setBirthDateError(
        '생년월일 형식이 올바르지 않습니다. YYYYMMDD 형식으로 입력해주세요.'
      );
    } else {
      setBirthDateError('');
    }

    setBirthDate(e.target.value);
  };

  const handleSubmitButtonClick = () => {
    const [year, month, day] = [
      birthDate.slice(0, 4),
      birthDate.slice(4, 6),
      birthDate.slice(6, 8),
    ];

    updateUserInfoMutate({
      userName: name,
      birthday: `${year}-${month}-${day}`,
      nickname,
      userProfile: profileImage || undefined,
      major: major.name || undefined,
    });
  };

  useEffect(() => {
    if (userInfo === undefined) {
      return;
    }

    const { userProfile, userName, birthday, nickname, major } = userInfo;

    setProfileImage(userProfile);
    setName(userName);
    setBirthDate(birthday.replaceAll('-', ''));
    setNickname(nickname);
    setMajor({
      id: major,
      name: major,
    });
  }, [userInfo]);

  if (status === 'loading') {
    return <div>loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <main className={styles.editInfoPage}>
      <header className={styles.topContainer}>
        <div>
          <BackAppBar notFixed />
        </div>
        <div className={styles.submitBtn}>
          <ActionButton
            type='button'
            disabled={isUpdateUserInfoPending}
            onClick={handleSubmitButtonClick}
          >
            완료
          </ActionButton>
        </div>
      </header>

      <section className={styles.profileContainer}>
        <h1 className={styles.pageTitle}>프로필 수정</h1>
        <div className={styles.updateProfileForm}>
          <div className={styles.profileImgContainer}>
            <div
              className={styles.profileImg}
              // onClick={() => document.getElementById('profileImageInput').click()}
            >
              <img
                // src={profileImage ?? defaultProfile}
                src={defaultProfile}
                alt='프로필'
                className={styles.profilePreview}
              />
              {/* <Icon
              className={styles.blueCamera}
              id='blue-camera'
              width={24}
              height={24}
            /> */}
            </div>
            {/* <input
            type='file'
            id='profileImageInput'
            style={{ display: 'none' }}
            accept='image/*'
            onChange={handleProfileImageChange}
          /> */}
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.infoWrapper}>
              <h3 className={styles.inputTitle}>이름</h3>
              <input
                type='text'
                className={`${styles.inputText} ${nameError ? styles.errorInputText : ''}`}
                placeholder='이름을 입력하세요'
                value={name}
                disabled={disabledPrivateUserInfoInput}
                onChange={handleNameChange}
              />
              {nameError && <p className={styles.errorMessage}>{nameError}</p>}
            </div>

            <div className={styles.infoWrapper}>
              <h3 className={styles.inputTitle}>생년월일</h3>
              <input
                type='text'
                className={`${styles.inputText} ${birthDateError ? styles.errorInputText : ''}`}
                placeholder='20020101'
                maxLength={12}
                value={birthDate.replaceAll('-', '')}
                pattern='\d{4}\.\d{2}\.\d{2}'
                title='형식: YYYYMMDD (예: 19060522)'
                disabled={disabledPrivateUserInfoInput}
                onChange={handleBirthDateChange}
              />
            </div>

            <div className={styles.infoWrapper}>
              <h3 className={styles.inputTitle}>닉네임</h3>
              <div className={styles.inputWrapper}>
                <input
                  type='text'
                  className={`${styles.inputText} ${nicknameError ? styles.errorInputText : ''}`}
                  placeholder='닉네임을 입력하세요'
                  value={nickname}
                  onChange={handleNicknameChange}
                />
                {nicknameError && (
                  <p className={styles.errorMessage}>{nicknameError}</p>
                )}
              </div>
            </div>

            <div className={styles.infoWrapper}>
              <CategoryFieldset title='전공' required>
                <Dropdown
                  options={MAJORS}
                  select={major}
                  setFn={setMajor}
                  placeholder='선택하세요'
                />
              </CategoryFieldset>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
