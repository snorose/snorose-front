import { defaultAxios, authAxios } from '@/axios';
import { IconItem } from '@storybook/blocks';
import { getBoardUrl } from '@/shared/lib';
import altImage from '@/assets/images/altImage.png';

// 게시글 리스트 가져오기
export const getPosts = async (boardId, page = 0) => {
  const url = getBoardUrl(boardId, page);

  const response = await authAxios.get(url);

  return response?.data.result;
};

// 게시글 상세 조회
export const getPostContent = async (boardId, postId) => {
  const response = await authAxios.get(`/v1/boards/${boardId}/posts/${postId}`);
  const result = response?.data.result;

  //url이 null일시 대체 이미지로 대체
  if (response?.data.result?.attachments.length) {
    const processedAttachments = response.data.result.attachments.map(
      (data) => ({
        ...data,
        url: data.url || altImage,
      })
    );
    return {
      ...result,
      attachments: processedAttachments,
    };
  }
  return result;
};

// 게시글 등록
export const postPost = async ({
  category = '',
  boardId,
  title,
  content,
  isNotice,
  attachmentsInfo = [],
}) => {
  //'게시글 생성' API에서 받아오는 데이터
  const response = await authAxios.post(`/v1/boards/${boardId}/posts/newpost`, {
    category,
    title,
    content,
    isNotice,
    attachments: attachmentsInfo?.length
      ? attachmentsInfo.map(({ type, fileName, fileComment }) => ({
          type,
          fileName,
          fileComment,
        }))
      : [],
  });

  //만일 '게시글 생성' API에 첨부파일을 넘겼더라면
  if (attachmentsInfo?.length) {
    //attachmentUrlList 변수에 '게시글 생성' API한테 받은 이미지 S3 url 리스트 저장
    let attachmentUrlList = response.data.result.attachmentUrlList;
    //각 S3 URL에 file 전달하기 (프런트에서 직접 버킷에 넣기)
    await putFileInBucket(
      attachmentUrlList,
      attachmentsInfo.map((att) => att.file)
    );
  }

  return response;
};

// 게시글 삭제
export const deletePost = async (boardId, postId) => {
  const response = await authAxios.delete(
    `/v1/boards/${boardId}/posts/${postId}`
  );
  return response;
};

// 게시글을 수정
export const patchPost = async ({
  boardId,
  postId,
  title,
  content,
  isNotice,
  attachmentsInfo,
  deleteAttachments,
}) => {
  const response = await authAxios.patch(
    `/v1/boards/${boardId}/posts/${postId}/update`,
    {
      category: '',
      title,
      content,
      isNotice,
      finalAttachments: attachmentsInfo.map(
        ({ id, fileName, fileComment, type }) => ({
          id,
          fileName,
          fileComment,
          type,
        })
      ),
      deleteAttachments,
    }
  );

  const newFiles = attachmentsInfo
    .filter((att) => att.id === '')
    .map((att) => att.file);
  let attachmentUrlList = response.data.result.attachmentUrlList;
  await putFileInBucket(attachmentUrlList, newFiles);

  return response;
};

// 게시글 신고
export const reportPost = async (boardId, postId, body) => {
  const { data } = await authAxios.post(
    `/v1/boards/${boardId}/posts/${postId}/report`,
    body
  );

  return data;
};

// 유저 신고
export const reportUser = async (body) => {
  const { data } = await authAxios.post(`/v1/users/report`, body);

  return data;
};

//게시글 썸네일 생성
export const createThumbnail = async (boardId, postId) => {
  await authAxios.post(`/v1/boards/${boardId}/posts/${postId}/thumbnail`);
};

//S3 URL에 file 전달하기 (프런트에서 직접 버킷에 넣기)
export const putFileInBucket = async (urls, files) => {
  await Promise.all(
    urls.map((url, index) => defaultAxios.put(url, files[index]))
  );
};
