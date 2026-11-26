import { useEffect, useRef, useState } from 'react';

import {
  IconMultiCheckBlueCircle,
  IconMultiCheckGreyCircle,
} from '@snorose/icons';

import usePopUp from '@/feature/home/hook/usePopUp';

import styles from './PopUp.module.css';
import { PopUpContents } from './PopUpContents';

const POPUP_HIDE_BUTTONS = [
  { label: '오늘 하루 보지 않기', duration: 0 },
  { label: '3일간 보지 않기', duration: 2 },
];

export default function PopUp() {
  const { isPopUpOpened, closePopUp, filteredContents } = usePopUp();
  const [selectedPopupHideDuration, setSelectedPopupHideDuration] = useState();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isPopUpOpened) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const dialog = dialogRef.current;
    dialog.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePopUp();
      }
      if (event.key !== 'Tab') return;
      const items = [
        ...dialog.querySelectorAll(
          'a[href], button:not(:disabled), [tabindex="0"]'
        ),
      ];
      const first = items[0];
      const last = items[items.length - 1];
      if (!first) {
        event.preventDefault();
        return;
      }
      if (
        !dialog.contains(document.activeElement) ||
        document.activeElement === dialog
      ) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [isPopUpOpened, closePopUp]);

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
      <div
        ref={dialogRef}
        className={styles.popUp}
        role='dialog'
        aria-modal='true'
        aria-labelledby='home-popup-title'
        tabIndex={-1}
      >
        <div className={styles.top}>
          <div className={styles.notice}>
            <h2 id='home-popup-title' className={styles.popupTitle}>
              스노로즈 공지
            </h2>
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
                {selectedPopupHideDuration === button.duration ? (
                  <IconMultiCheckBlueCircle className={styles.hideButtonIcon} />
                ) : (
                  <IconMultiCheckGreyCircle className={styles.hideButtonIcon} />
                )}
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
