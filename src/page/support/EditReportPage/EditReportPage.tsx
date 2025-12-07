import { useParams } from 'react-router-dom';

export default function EditReportPage() {
  const { reportId } = useParams();

  return (
    <div>
      <div>EditReportPage</div>
      <div>reportId: {reportId}</div>
    </div>
  );
}
