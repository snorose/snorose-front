import { IBoardDetailResponse, IPostCreateResponse } from "./board.http";
import { ICommentCreateResponse, ICommentData, ICommentListResponse } from "./comment.http";
import { IAddPointResponse } from "./point.http";

export function isBoardDetailResponse(response: any): response is IBoardDetailResponse {
  return response && typeof response === 'object' && 'result' in response &&
    typeof response.result.postId === 'number';
}

export function isCommentListResponse(response: any): response is ICommentListResponse {
  return response && typeof response === 'object' && 'result' in response && Array.isArray(response.result) &&
    response.result.every((comment: any) => isCommentData(comment));
}

export function isPostCreateResponse(response: any): response is IPostCreateResponse {
  return response && typeof response === 'object' && 'result' in response && 'postId' in response.result;
}

export function isAddPointResponse(response: any): response is IAddPointResponse {
  return response && typeof response === 'object' && 'result' in response && 'category' in response.result && 'difference' in response.result && 'balance' in response.result;
}

export function isCommentResponse(response: any): response is ICommentCreateResponse {
  return response && typeof response === 'object' && 'result' in response &&
    typeof response.result.id === 'number' &&
    typeof response.result.postId === 'number' &&
    (typeof response.result.userProfile === 'string' || response.result.userProfile === null) &&
    typeof response.result.userDisplay === 'string' &&
    typeof response.result.content === 'string' &&
    typeof response.result.likeCount === 'number' &&
    typeof response.result.reportCount === 'number' &&
    typeof response.result.createdAt === 'string' &&
    (typeof response.result.updatedAt === 'string' || response.result.updatedAt === null) &&
    (typeof response.result.deletedAt === 'string' || response.result.deletedAt === null) &&
    typeof response.result.isVisible === 'boolean' &&
    typeof response.result.isUpdated === 'boolean' &&
    typeof response.result.isDeleted === 'boolean' &&
    (typeof response.result.parentId === 'number' || response.result.parentId === null) &&
    Array.isArray(response.result.children) &&
    response.result.children.every((child: any) => isCommentData(child));
}

export function isCommentData(data: any): data is ICommentData {
  return typeof data.id === 'number' &&
    typeof data.postId === 'number' &&
    (typeof data.userProfile === 'string' || data.userProfile === null) &&
    typeof data.userDisplay === 'string' &&
    typeof data.content === 'string' &&
    typeof data.likeCount === 'number' &&
    typeof data.reportCount === 'number' &&
    typeof data.createdAt === 'string' &&
    (typeof data.updatedAt === 'string' || data.updatedAt === null) &&
    (typeof data.deletedAt === 'string' || data.deletedAt === null) &&
    typeof data.isVisible === 'boolean' &&
    typeof data.isUpdated === 'boolean' &&
    typeof data.isDeleted === 'boolean' &&
    (typeof data.parentId === 'number' || data.parentId === null) &&
    Array.isArray(data.children);
}
