import { Observable } from "rxjs";
import { IBaseResponse } from "./baseResponse.dto";
import { inject } from "@angular/core";
import { HttpService } from "../services/http.service";

export interface IBoardListData {
  postId: number;
  title: string;
  userDisplay: string;
  likeCount: number;
  viewCount: number;
  createdAt: string;
  notice: boolean;
}

export interface IBoardListResponse extends IBaseResponse<Array<IBoardListData>> { }

export interface IBoardDetailData {
  postId: number;
  userId: number;
  userDisplay: string;
  title: string;
  content: string;
  viewCount: number;
  likeCount: number;
  scrapCount: number;
  reportCount: number;
  createdAt: string;
  updatedAt: string | null;
  visible: boolean;
  category: string | null;
  edited: boolean;
  notice: boolean;
}

export interface IBoardDetailResponse extends IBaseResponse<IBoardDetailData> { }

export interface IPostCreateRequest {
  title: string;
  content: string;
  userdisplay: string;
}

export interface IPostCreateResponse extends IBaseResponse<{ postId: number; }> { }

export interface IPostUpdateResquest {
  title: string;
  content: string;
  category: string;
}

export interface IPostUpdateData {
  id: number;
  userId: number;
  userDisplay: string;
  title: string;
  content: string;
  viewCount: number;
  likeCount: number;
  scrapCount: number;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
  visible: boolean;
  category: string;
  edited: boolean;
  notice: boolean;
}

export interface IPostUpdateResponse extends IBaseResponse<IPostUpdateData> { }

export interface IBoardHttp {
  getList(boardId: string, page: number): Observable<IBoardListResponse>;
  getDetail(boardId: string, postId: string): Observable<IBoardDetailResponse>;
  create(boardId: string, request: IPostCreateRequest): Observable<IPostCreateResponse>;
  update(boardId: string, postId: string, request: IPostUpdateResquest): Observable<IPostUpdateResponse>;
}

export class BoardHttp implements IBoardHttp {

  private readonly httpService = inject(HttpService);

  getList(boardId: string, page: number): Observable<IBoardListResponse> {
    return this.httpService.Get(`/v1/boards/${boardId}/posts/postlist/${page}`);
  }

  getDetail(boardId: string, postId: string): Observable<IBoardDetailResponse> {
    return this.httpService.Get(`/v1/boards/${boardId}/posts/${postId}`);
  }

  create(boardId: string, request: IPostCreateRequest): Observable<IPostCreateResponse> {
    return this.httpService.Post(`/v1/boards/${boardId}/posts/newpost`, request);
  }

  update(boardId: string, postId: string, request: IPostUpdateResquest): Observable<IPostUpdateResponse> {
    return this.httpService.Post(`/v1/boards/${boardId}/posts/${postId}/update`, request);
  }

}