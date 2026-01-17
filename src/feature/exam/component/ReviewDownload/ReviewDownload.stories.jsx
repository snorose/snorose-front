import { Icon } from '@/shared/component';
import styles from './ReviewDownload.module.css';

// 스토리북용 Mock 컴포넌트 - 빈 PDF 다운로드
function MockReviewDownload({ className, fileName }) {
  const handleDownload = () => {
    // 빈 PDF 파일 생성 및 다운로드
    const pdfContent =
      '%PDF-1.4\n%âãÏÓ\n1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type/Pages/Kids[3 0 R]/Count 1>>\nendobj\n3 0 obj\n<</Type/Page/Parent 2 0 R/Resources<</Font<</F1<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>>>/ProcSet[/PDF/Text]>>/MediaBox[0 0 612 792]/Contents 4 0 R>>\nendobj\n4 0 obj\n<</Length 55>>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Storybook Sample PDF) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000015 00000 n \n0000000060 00000 n \n0000000111 00000 n \n0000000295 00000 n \ntrailer\n<</Size 5/Root 1 0 R>>\nstartxref\n398\n%%EOF';

    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const fileUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', fileUrl);
    link.setAttribute('download', fileName);
    link.click();
    window.URL.revokeObjectURL(fileUrl);
  };

  return (
    <button
      className={`${styles.layout} ${className || ''}`}
      onClick={handleDownload}
    >
      <Icon id='file' width={10} height={14} />
      <span className={styles.name}>{fileName}</span>
    </button>
  );
}

const reviewDownloadStoryConfig = {
  title: 'Feature/Exam/ReviewDownload',
  component: MockReviewDownload,
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'ReviewDownload 컴포넌트는 족보 파일을 다운로드할 수 있는 버튼 컴포넌트입니다.<br />' +
          '파일 아이콘과 파일명을 표시하며, 클릭 시 다운로드가 시작됩니다.<br /><br />' +
          '**참고:** 실제 동작에서는 `isWriter`와 `isDownloaded` props에 따라 모달 표시 여부가 결정됩니다.',
      },
    },
  },
  argTypes: {
    className: {
      description: '추가 CSS 클래스',
      control: 'text',
    },
    fileName: {
      description: '다운로드할 파일 이름',
      control: 'text',
    },
  },
};
export default reviewDownloadStoryConfig;

const Template = (args) => <MockReviewDownload {...args} />;

export const Default = Template.bind({});
Default.args = {
  fileName: '2024-1학기-중간고사-족보.pdf',
};
