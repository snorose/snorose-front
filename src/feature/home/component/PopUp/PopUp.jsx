import { useState } from 'react';

import { usePopUp } from '@/feature/home/hook';
import styles from './PopUp.module.css';
import calendar from './calendar.png';

const content = (
  <div className={styles.notice}>
    <div>
      <p className={styles.hello}>
        ❄️ 안녕하세요. 숙명인을 위한 커뮤니티, 스노로즈입니다. ❄️
      </p>

      <Heading>1. 1월 캘린더</Heading>
      <Content>
        <img src={calendar} alt='1월 캘린더' />
      </Content>

      <hr />
      <Content>
        ※ 공식 문의 창구 (
        <span>
          이메일(
          <a
            href='mailto:snorose1906@gmail.com'
            style={{ color: '#007bff', textDecoration: 'underline' }}
          >
            snorose1906@gmail.com
          </a>
          )
        </span>
        , 카카오톡 1:1 문의) 이외의 문의는 받고 있지 않습니다. 공식 문의 창구
        이외의 문의 글은 답변 없이 삭제될 수 있음을 알려드립니다.
      </Content>
    </div>
  </div>
);

export default function PopUp() {
  const [popupHideDuration, setPopupHideDuration] = useState();
  const updatePopupHideDuration = (event) => {
    const { value } = event.target;
    setPopupHideDuration(Number(value));
  };

  const { isPopUpOpened, closePopUp } = usePopUp();
  const close = () => closePopUp({ popupHideDuration });

  if (!isPopUpOpened) {
    return null;
  }

  return (
    <section className={styles.container}>
      <div className={styles.popUp}>
        <div className={styles.top}>
          <pre>{content}</pre>
        </div>
        <div className={styles.bottom}>
          <div className={styles.radios} onChange={updatePopupHideDuration}>
            <label className={styles.radio}>
              <input type='radio' value={0} name='hideDuration' />
              <span>오늘 하루 보지 않기</span>
            </label>
            <label className={styles.radio}>
              <input type='radio' value={2} name='hideDuration' />
              <span>3일간 보지 않기</span>
            </label>
          </div>
          <button onClick={close}>닫기</button>
        </div>
      </div>
    </section>
  );
}

export function Heading({ children }) {
  return <h2 className={styles.title}>{children}</h2>;
}

export function SubHeading({ children }) {
  return <h3 className={styles.subTitle}>{children}</h3>;
}

export function Content({ children }) {
  return <p className={styles.content}>{children}</p>;
}
