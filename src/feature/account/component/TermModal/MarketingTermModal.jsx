import TermModal from './TermModal';

export default function MarketingTermModal({ onAgree, onClose }) {
  return (
    <TermModal
      title="광고성 알림 수신 동의"
      onAgree={onAgree}
      onSkip={onClose}
      onClose={onClose}
    >
      <section>
        <p>광고성 알림 수신 동의 내용이 여기에 들어갑니다.</p>
      </section>
    </TermModal>
  );
}
