import { useState } from 'react';

import { Accordion } from '@/feature/home/component';

import style from './FAQPage.module.css';
import { BackAppBar } from '@/shared/component';

export default function FAQPage() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div className={style.container}>
      <BackAppBar title='자주 묻는 질문' notFixed />

      <div className={style.noticeContainer}>
        {`자주 묻는 질문을 확인해보세요.\n궁금하신 점이 해결되지 않았다면,\n카카오톡 1:1 문의 및 이메일 snorose1906@gmail.com를 통해 연락해주세요.`}
      </div>

      <div className={style.notice}>
        <Accordion
          title={'푸시 알림이 안 와요.'}
          isOpen={isOpen}
          onClick={toggle}
        >
          <div className={style.noticeBody}>
            {notice.map(({ title, list, listStyle }) => (
              <div>
                <h3 className={style.title}>{title}</h3>
                <ul className={listStyle === 'none' && style.listStyleNone}>
                  {list.map((item) => (
                    <li>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Accordion>
      </div>
    </div>
  );
}

const notice = [
  {
    title: `< 주의사항 >`,
    list: [
      `푸시 알림은 스마트폰으로만 받을 수 있어요.`,
      `iOS는 'Safari - 홈 화면에 추가(PWA 설치)' 환경에서만 푸시 알림을 지원해요.`,
      `Android는 Chrome 브라우저 사용을 권장해요.`,
      `인스타그램, 네이버 등 인앱 브라우저는 푸쉬 알림을 지원하지 않아요.`,
    ],
  },
  {
    title: `< 알림 설정 방법 >`,
    list: [
      `1️⃣ 하단 메뉴 [알림] → 우측 상단 ⚙️(톱니바퀴) 아이콘 → '알림 받기' 토글을 ON으로 변경해주세요.`,
      `2️⃣ 처음 알림을 설정하는 경우 "알림 권한 요청" 창이 나타나요. '허용'을 누른 후 설정이 반영되기까지 최대 5초 정도 걸려요.`,
      `3️⃣ 알림 권한을 거절한 경우 아래 OS별 지침을 따라주세요.`,
    ],
    listStyle: 'none',
  },
  {
    title: `[Android]`,
    list: [
      `Chrome(또는 사용 중인 브라우저) 설정 → 사이트 설정 → 알림 → snorose.com → '허용'으로 변경해주세요.`,
      `홈 화면 추가(PWA)로 이용하는 경우도 브라우저 설정에서 사이트 알림 권한을 '허용'으로 바꿔야 해요.`,
    ],
  },
  {
    title: `[iOS]`,
    list: [
      `'홈 화면 추가(PWA)' 상태에서 진행해주세요. (Safari 하단 공유 아이콘 → '홈 화면에 추가' 선택)`,
      `아이폰 설정 → 앱 → 스노로즈 → 알림 → '허용'으로 변경해주세요.`,
    ],
  },
  {
    title: `💡 알림이 오지 않는다면`,
    list: [
      `'알림 받기' 토글이 켜져 있고, 브라우저/기기 알림 권한이 '허용' 상태인지 확인해주세요.`,
    ],
  },
];
