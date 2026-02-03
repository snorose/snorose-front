import { useToast } from '@/shared/hook';
import { ATTACHMENT_SIZE_LIMIT } from '@/shared/constant';
import {
  combineFilters,
  filterOversizedImage,
  filterOversizedVideo,
  filterUnusableCharNamedAtts,
  checkIfImage,
  checkImageQuantity,
  checkImageSize,
  checkIfVideo,
  checkVideoQuantity,
  checkVideoSize,
  checkIfFilesContainUnusableChar,
} from '@/feature/attachment/lib';

export function useAttachmentUpload({ attachmentsInfo, setAttachmentsInfo }) {
  const { toast } = useToast();
  const changeImageUpload = (e) => {
    const newFiles = e.target.files;
    const newFileArray = Array.from(newFiles).filter(
      (file) => file.size <= ATTACHMENT_SIZE_LIMIT.imageFileSize
    );
    const filteredFileArray = combineFilters(
      [filterOversizedImage, filterUnusableCharNamedAtts],
      newFiles
    );

    //이미지 정책 확인하기
    try {
      //아예 처음부터 다시 이미지 선택해야하는 경우
      checkIfImage(newFiles);
      checkImageQuantity(attachmentsInfo, newFiles);

      //정책에 맞는건 남기고 안 맞는건 버리는 경우
      const warningMessage =
        checkImageSize(newFiles) || checkIfFilesContainUnusableChar(newFiles);
      if (warningMessage) {
        toast({
          message: warningMessage,
          variant: 'error',
        });
      }
    } catch (err) {
      toast({ message: err.message, variant: 'error' });
      return;
    }

    //백엔드에서 요구하는 body에 맞춰 데이터 가공
    const mappedFiles = newFileArray.map((file) => ({
      fileName: file.name,
      fileComment: '',
      fileType: file.type,
      type: 'PHOTO',
      file,
      id: '',
    }));

    setAttachmentsInfo((prev) => [...prev, ...mappedFiles]);
    e.target.value = null;
  };

  const changeVideoUpload = (e) => {
    const newFiles = e.target.files;
    const newFileArray = Array.from(newFiles).filter(
      (file) => file.size <= ATTACHMENT_SIZE_LIMIT.videoFileSize
    );

    //동영상 정책 확인하기
    try {
      //아예 처음부터 다시 이미지 선택해야하는 경우 (애초에 영상 개수 제한 1개라서 모두 여기에 해당)
      checkIfVideo(newFiles);
      checkVideoQuantity(attachmentsInfo, newFiles);
      checkVideoSize(newFiles);
    } catch (err) {
      toast({ message: err.message, variant: 'error' });
      return;
    }

    //백엔드에서 요구하는 body에 맞춰 데이터 가공
    const mappedFiles = newFileArray.map((file) => ({
      fileName: file.name,
      fileComment: '',
      fileType: file.type,
      type: 'VIDEO',
      file,
      id: '',
    }));

    setAttachmentsInfo((prev) => [...prev, ...mappedFiles]);
    e.target.value = null;
  };

  return {
    changeImageUpload,
    changeVideoUpload,
  };
}
