import { useParams } from 'react-router-dom';

export default function EditInquiryPage() {
  const { inquireId } = useParams();

  return (
    <div>
      <div>EditInquiryPage</div>
      <div>inquireId: {inquireId}</div>
    </div>
  );
}
