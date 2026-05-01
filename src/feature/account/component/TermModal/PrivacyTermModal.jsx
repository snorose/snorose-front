import { PRIVACY_TERM } from '@/feature/account/constant/privacyTerm';

import TermModal from './TermModal';
import styles from './PrivacyTermModal.module.css';

const EMAIL = 'smsnorose@gmail.com';

function renderWithEmailLink(content) {
  const parts = content.split(EMAIL);
  if (parts.length === 1) return content;
  return (
    <>
      {parts[0]}
      <a href={`mailto:${EMAIL}`} className={styles.emailLink}>
        {EMAIL}
      </a>
      {parts[1]}
    </>
  );
}

export default function PrivacyTermModal({ onAgree, onClose }) {
  return (
    <TermModal
      title={PRIVACY_TERM.title}
      required
      onAgree={onAgree}
      onClose={onClose}
    >
      <section>
        <p className={styles.summaryText}>{PRIVACY_TERM.summary}</p>
      </section>

      <section>
        <p className={styles.summaryText}>{PRIVACY_TERM.guide}</p>
      </section>

      {PRIVACY_TERM.details.map((section, idx) => (
        <section key={idx}>
          <h2>{section.title}</h2>
          <p className={styles.detailText}>
            {renderWithEmailLink(section.content)}
          </p>
        </section>
      ))}

      <section>
        <p className={styles.detailText}>{PRIVACY_TERM.notice}</p>
      </section>
    </TermModal>
  );
}
