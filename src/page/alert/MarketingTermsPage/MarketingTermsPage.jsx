import { BackAppBar } from '@/shared/component';

import { MARKETING_TERMS } from '@/feature/alert/constant';

import styles from './MarketingTermsPage.module.css';

export default function MarketingTermsPage() {
  return (
    <div className={styles.contianer}>
      <BackAppBar />

      <div className={styles.title}>마케팅 정보 수신 동의 약관</div>

      <div className={styles.body}>
        <div>
          스노로즈는 이용자의 동의를 받아 이벤트, 혜택, 최신 정보 등 마케팅
          목적의 정보를 전송하고자 합니다. 동의를 거부하셔도 서비스 이용에는
          제한이 없습니다.
        </div>

        {MARKETING_TERMS.map(({ title, list, content }) => (
          <div key={`terms-merketing-${title}`}>
            <div className={styles.subTitle}>{title}</div>
            <div className={styles.content}>{content}</div>
            {list && <TermsList list={list} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function TermsList({ list }) {
  return (
    <ul className={styles.list}>
      {list.map((item) => (
        <li key={`terms-marketing-${item}`}>{item}</li>
      ))}
    </ul>
  );
}
