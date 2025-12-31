import { usePopUp } from '@/feature/home/hook';
import styles from './PopUp.module.css';
import { PopUpContents, hasValidContents } from './PopUpContents';

const POPUP_FOOTER_BUTTONS = [
  { label: '오늘 하루 보지 않기', duration: 0, className: 'hideButton' },
  { label: '3일간 보지 않기', duration: 2, className: 'hideButton' },
  { label: '닫기', duration: undefined, className: 'closeButton' },
];

export default function PopUp() {
  const { isPopUpOpened, closePopUp } = usePopUp();

  const handleCloseButtonClick = (popupHideDuration) => {
    closePopUp({ popupHideDuration });
  };

  if (!isPopUpOpened || !hasValidContents()) {
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
            <PopUpContents />
          </div>
        </div>

        <div className={styles.bottom}>
          {POPUP_FOOTER_BUTTONS.map((button) => (
            <button
              key={button.label}
              onClick={() => handleCloseButtonClick(button.duration)}
              className={styles[button.className]}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
