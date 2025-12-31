import styles from './PopUpContents.module.css';
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

export default function PopUpContents() {
  return (
    <div className={styles.popupSectionContainer}>
      {POPUP_CONTENTS.map((section) => (
        <div key={section.title} className={styles.popupSection}>
          {section.title && (
            <h3 className={styles.popupSectionTitle}>{section.title}</h3>
          )}

          {section.content && (
            <ul>
              {section.content.map((content) => (
                <li key={content} className={styles.popupSectionContent}>
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
  );
}
