import { Observable } from "rxjs";
import { IBaseResponse } from "./baseResponse.dto";
import { HttpService } from "../services/http.service";
import { inject } from "@angular/core";

export enum Semester {
  First = 'FIRST', // 1학기 
  Second = 'SECOND', // 2학기
  Summer = 'SUMMER',	// 여름학기
  Winter = 'WINTER', // 겨울학기
  Other = 'OTHER', 	// 기타
}

export enum LectureType {
  MajorRequired = 'MAJOR_REQUIRED',	// 전공필수
  MajorElective = 'MAJOR_ELECTIVE',	// 전공선택
  GeneralRequired = 'GENERAL_REQUIRED',	// 교양 필수
  GeneralElective = 'GENERAL_ELECTIVE',	// 교양 선택
  Other = 'OTHER',	// 기타
}

export interface IReviewCreateRequest {
  // 게시글 정보
  boardId: number;
  userDisplay: string;
  category: string;
  title: string;
  content: string;

  // 강의 정보
  lectureName: string;
  professor: string;
  classNumber: number;
  lectureYear: number;
  semester: Semester;
  hasMidterm: boolean;
  hasFinalterm: boolean;
  lectureType: LectureType;
  isPF: boolean;

  // 파일 정보
  filePath: string | null;
  fileName: string;
}

export interface IReviewUpdateRequest {
  // 게시글 정보
  category: string;
  title: string;
  content: string;

  // 강의 정보
  lectureName: string;
  professor: string;
  classNumber: number;
  lectureYear: number;
  semester: Semester;
  hasMidterm: boolean;
  hasFinalterm: boolean;
  lectureType: LectureType;
  isPF: boolean;

  // 파일 정보
  filePath: string;
  fileName: string;
}

export interface IReviewListData {
  userDisplay: string;
  postId: number,
  title: string;
  createdAt: string;
  likeCount: number;
  viewCount: number;
}

export interface IReviewListResponse extends IBaseResponse<Array<IReviewListData>> { }

export interface IReviewGetData {
  userDisplay: string;
  title: string;
  content: string;

  // 게시물 정보
  viewCount: number;
  scrapCount: number;
  likeCount: number;
  createdAt: string;

  // 강의 정보
  lectureName: string;
  professor: string;
  classNumber: number;
  lectureYear: number;
  semester: Semester;
  lectureType: LectureType;
  isPF: boolean;

  // 파일 정보
  filePath: string;
  fileName: string;
}

export interface IReviewDetailResponse extends IBaseResponse<IReviewGetData> { }
export interface IReviewCreateResponse extends IBaseResponse<{ postId: number; }> { }
export interface IReviewUpdateResponse extends IBaseResponse<{ postId: number; }> { }

export interface IReviewHttp {
  getList(boardId: string, page: number): Observable<IReviewListResponse>;
  getDetail(postId: string): Observable<IReviewDetailResponse>;
  create(request: IReviewCreateRequest): Observable<IReviewCreateResponse>;
  update(postId: string, request: IReviewUpdateRequest): Observable<IReviewUpdateResponse>;
}

export class ReviewHttp implements IReviewHttp {

  private readonly httpService = inject(HttpService);

  public getList(boardId: string, page: number): Observable<IReviewListResponse> {
    return this.httpService.Get(`/v1/reviews/${boardId}/list/${page}`);
  }

  public getDetail(postId: string): Observable<IReviewDetailResponse> {
    return this.httpService.Get(`/v1/reviews/${postId}`);
  }

  public create(request: IReviewCreateRequest): Observable<IReviewCreateResponse> {
    return this.httpService.Post(`/v1/reviews/review`, request);
  }

  public update(postId: string, request: IReviewUpdateRequest): Observable<IReviewUpdateResponse> {
    return this.httpService.Patch(`/v1/reviews/${postId}`, request);
  }

}