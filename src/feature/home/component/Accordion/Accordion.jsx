import { IconChevronDown } from '@snorose/icons';

import { PrimaryButton } from '@/shared/component';

import styles from './Accordion.module.css';

const RECRUIT_START = new Date('2025-12-01T00:00:00+09:00');
const RECRUIT_END = new Date('2025-12-28T00:00:00+09:00');

const goApply = () => {
  window.location.href =
    'https://www.notion.so/snorose/10c7ef0aa3bf8027a04ee35b7c521e12';
};

export default function Accordion({ title, children, isOpen, onClick }) {
  const now = new Date();
  const isRecruit = now >= RECRUIT_START && now <= RECRUIT_END;

  return (
    <div className={`${styles.accordion} ${isOpen && styles.opend}`}>
      <div className={`${styles.panelHeader}`} onClick={onClick}>
        <span>{title}</span>
        <IconChevronDown
          className={styles.toggleIcon}
          color='var(--blue-4)'
        />
      </div>
      <div className={`${styles.panelBody}`}>{children}</div>
      {title === '명예의 전당' && isOpen && (
        <PrimaryButton className={styles.apply} onClick={goApply}>
          {isRecruit ? '리자 지원하러 가기' : '지난 모집 공고 확인하기'}
        </PrimaryButton>
      )}
    </div>
  );
}
