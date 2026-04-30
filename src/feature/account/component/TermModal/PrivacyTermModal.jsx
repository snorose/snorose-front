import { PRIVACY_TERM } from '@/feature/account/constant/privacyTerm';
import TermModal from './TermModal';

export default function PrivacyTermModal({ onAgree, onClose }) {
  return (
    <TermModal
      title={PRIVACY_TERM.title}
      onAgree={onAgree}
      onClose={onClose}
    >
      <section>
        <p>{PRIVACY_TERM.summary}</p>
      </section>
      
      <section>
        <p>{PRIVACY_TERM.guide}</p>
      </section>
      
      {PRIVACY_TERM.details.map((section, idx) => (
        <section key={idx}>
          <h2>{section.title}</h2>
          <p>{section.content}</p>
        </section>
      ))}
      
      <section>
        <p>{PRIVACY_TERM.notice}</p>
      </section>
    </TermModal>
  );
}
