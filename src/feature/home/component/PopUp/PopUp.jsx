import { useState } from 'react';

import { Icon } from '@/shared/component';

import { usePopUp } from '@/feature/home/hook';

import styles from './PopUp.module.css';
import { getFilteredContents, PopUpContents } from './PopUpContents';

const POPUP_HIDE_BUTTONS = [
  { label: '오늘 하루 보지 않기', duration: 0 },
  { label: '3일간 보지 않기', duration: 2 },
];

export default function PopUp() {
  const { isPopUpOpened, closePopUp } = usePopUp();
  const [selectedPopupHideDuration, setSelectedPopupHideDuration] = useState();
  const filteredContents = getFilteredContents();

  const handleHideButtonClick = (popupHideDuration) => {
    setSelectedPopupHideDuration((prevDuration) =>
      prevDuration === popupHideDuration ? undefined : popupHideDuration
    );
  };

  const handleCloseButtonClick = () => {
    closePopUp({ popupHideDuration: selectedPopupHideDuration });
  };

  if (!isPopUpOpened || filteredContents.length === 0) {
    return null;
  }

  return (
    <section className={styles.container}>
      <div className={styles.popUp}>
        <div className={styles.top}>
          <div className={styles.notice}>
            <span className={styles.popupTitle}>스노로즈 공지</span>
            <p className={styles.popupContent}>
              안녕하세요!
              <br />
              숙명인을 위한 커뮤니티, 스노로즈입니다.
            </p>
            <PopUpContents filteredContents={filteredContents} />
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <div className={styles.hideButtonContainer}>
            {POPUP_HIDE_BUTTONS.map((button) => (
              <button
                key={button.label}
                type='button'
                role='checkbox'
                aria-checked={selectedPopupHideDuration === button.duration}
                onClick={() => handleHideButtonClick(button.duration)}
                className={styles.hideButton}
              >
                <Icon
                  id={
                    selectedPopupHideDuration === button.duration
                      ? 'checkbox-blue'
                      : 'checkbox-grey'
                  }
                  className={styles.hideButtonIcon}
                />
                {button.label}
              </button>
            ))}
          </div>
          <button
            type='button'
            onClick={() => handleCloseButtonClick()}
            className={styles.closeButton}
          >
            닫기
          </button>
        </div>
      </div>
    </section>
  );
}
