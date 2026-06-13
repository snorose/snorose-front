import { usePopUp } from '@/feature/home/hook';

import styles from './PopUp.module.css';
import { getFilteredContents, PopUpContents } from './PopUpContents';

const POPUP_HIDE_BUTTONS = [
  { label: '오늘 하루 보지 않기', duration: 0, className: 'hideButton' },
  { label: '3일간 보지 않기', duration: 2, className: 'hideButton' },
];

export default function PopUp() {
  const { isPopUpOpened, closePopUp } = usePopUp();
  const filteredContents = getFilteredContents();

  const handleCloseButtonClick = (popupHideDuration) => {
    closePopUp({ popupHideDuration });
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
          {POPUP_HIDE_BUTTONS.map((button) => (
            <button
              key={button.label}
              onClick={() => handleCloseButtonClick(button.duration)}
              className={`${styles.button} ${styles[button.className]}`}
            >
              {button.label}
            </button>
          ))}
          <button
            onClick={() => handleCloseButtonClick()}
            className={`${styles.button} ${styles.closeButton}`}
          >
            닫기
          </button>
        </div>
      </div>
    </section>
  );
}
