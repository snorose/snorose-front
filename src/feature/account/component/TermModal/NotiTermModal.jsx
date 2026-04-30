import TermModal from './TermModal';

export default function NotiTermModal({ onAgree, onClose }) {
  return (
    <TermModal
      title="알림 수신 동의"
      onAgree={onAgree}
      onClose={onClose}
    >
      <section>
        <p>알림 수신 동의 내용이 여기에 들어갑니다.</p>
      </section>
    </TermModal>
  );
}
