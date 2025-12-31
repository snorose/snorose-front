import { usePopUp } from '@/feature/home/hook';
import styles from './PopUp.module.css';
import calendar from './calendar.png';

const POPUP_CONTENTS = [
  {
    title: '1월 스노로즈 일정',
    content: null,
    image: calendar,
  },
  {
    title: null,
    content: [
      '스노로즈 인스타그램(@snorose1906)에서 월별 스노로즈 일정을 쉽게 확인할 수 있습니다.',
      '공식 문의 창구 [이메일(snorose1906@gmail.com), 카카오톡 1:1 문의] 이외의 문의는 받고 있지 않습니다. 공식 문의 창구 이외의 문의 글은 답변 없이 삭제될 수 있음을 알려드립니다.',
    ],
    image: null,
  },
];

export default function PopUp() {
  const { isPopUpOpened, closePopUp } = usePopUp();

  const handleCloseButtonClick = (popupHideDuration) => {
    closePopUp({ popupHideDuration });
  };

  if (!isPopUpOpened) {
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

            <div className={styles.popupSectionContainer}>
              {POPUP_CONTENTS.map((section) => (
                <div key={section.title} className={styles.popupSection}>
                  {section.title && (
                    <h3 className={styles.popupSectionTitle}>
                      {section.title}
                    </h3>
                  )}

                  {section.content && (
                    <ul>
                      {section.content.map((content) => (
                        <li
                          key={content}
                          className={styles.popupSectionContent}
                        >
                          {content}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.image && (
                    <img
                      src={section.image}
                      alt={section.title}
                      className={styles.popupSectionImage}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <button
            onClick={() => handleCloseButtonClick(0)}
            className={styles.hideButton}
          >
            오늘 하루 보지 않기
          </button>
          <button
            onClick={() => handleCloseButtonClick(2)}
            className={styles.hideButton}
          >
            3일간 보지 않기
          </button>
          <button
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
