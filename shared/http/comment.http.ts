import { Observable } from "rxjs";
import { IBaseResponse } from "./baseResponse.dto";
import { inject } from "@angular/core";
import { HttpService } from "../services/http.service";

export interface ICommentData {
  id: number;
  postId: number;
  userProfile: string | null;
  userDisplay: string;
  isWriter: boolean;
  content: string;
  likeCount: number;
  reportCount: number;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  isVisible: boolean;
  isUpdated: boolean;
  isDeleted: boolean;
  parentId: number | null;
  children: ICommentData[];
}

export interface ICommentCreateRequest {
  userDisplay: string;
  parentId: number | null;
  content: string;
}

export interface ICommentUpdateRequest {
  content: string;
}

export interface ICommentListResponse extends IBaseResponse<Array<ICommentData>>{}
export interface ICommentCreateResponse extends IBaseResponse<ICommentData>{}
export interface ICommentUpdateResponse extends IBaseResponse<ICommentData>{}
export interface ICommentDeleteResponse extends IBaseResponse<ICommentData>{}

export interface ICommentHttp {
  getList(postId: string): Observable<ICommentListResponse>;
  create(postId: string, request: ICommentCreateRequest): Observable<ICommentCreateResponse>;
  update(postId: number, commentId: number, request: ICommentUpdateRequest): Observable<ICommentUpdateResponse>;
  delete(postId: number, commentId: number): Observable<ICommentDeleteResponse>;
}

export class CommentHttp implements ICommentHttp {

  private readonly httpService = inject(HttpService);

  getList(postId: string): Observable<ICommentListResponse> {
    return this.httpService.Get(`/v1/posts/${postId}/comments`);
  }
  
  create(postId: string, request: ICommentCreateRequest): Observable<ICommentCreateResponse> {
    return this.httpService.Post(`/v1/posts/${postId}/comments`, request);
  }
  
  update(postId: number, commentId: number, request: ICommentUpdateRequest): Observable<ICommentUpdateResponse> {
    return this.httpService.Patch(`/v1/posts/${postId}/comments/${commentId}`, request);
  }

  delete(postId: number, commentId: number): Observable<ICommentDeleteResponse> {
    return this.httpService.Delete(`/v1/posts/${postId}/comments/${commentId}`);
  }

}
