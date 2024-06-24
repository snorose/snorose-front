import { Component, OnInit, inject } from '@angular/core';
import { IBoardDetailData } from '../../../../shared/http/board.http';
import { ActivatedRoute } from '@angular/router';
import { DalService } from '../../../../shared/services/dal.service';
import { ICommentCreateRequest, ICommentData } from '../../../../shared/http/comment.http';
import { Location } from '@angular/common';
import { LayoutService } from '../../../../shared/services/layout.service';
import { ScrollService } from './../../../../shared/services/scroll.service';
import { MembershipService } from '../../../../shared/services/membership.service';
import { filter, map, mergeMap, of, tap, withLatestFrom } from 'rxjs';
import { IAddPointRequest } from '../../../../shared/http/point.http';
import { POINT_CATEGORY, POINT_SOURCE } from '../../../../shared/data/point.data';
import { GlobalService } from '../../../../shared/services/global.service';
import { isBoardDetailResponse, isCommentListResponse } from '../../../../shared/http/type-guard';
import { ICommnetUpdate } from '../comments/comment/comment.component';

@Component({
  selector: 'app-board-detail',
  templateUrl: './board-detail.component.html',
  styleUrl: './board-detail.component.scss'
})
export class BoardDetailComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly dalService = inject(DalService);
  private readonly location = inject(Location);
  public readonly layoutService = inject(LayoutService);
  private scrollService = inject(ScrollService);
  private readonly membershipService = inject(MembershipService);
  private globalService = inject(GlobalService);

  public boardId: string | null = null;
  public postId: string | null = null;
  public commentId: number | null = null;
  public isLoading: boolean = true;
  public isCommentLoading: boolean = true;

  public detailData: IBoardDetailData = {
    postId: 1,
    userId: 1,
    userDisplay: '송이',
    title: '글 제목',
    content: '글 내용 입니다. 글 내용 입니다. 글 내용 입니다. 글 내용 입니다.',
    viewCount: 0,
    likeCount: 0,
    scrapCount: 0,
    reportCount: 0,
    createdAt: '2024-01-31',
    updatedAt: '2024-01-31',
    visible: true,
    category: null,
    edited: false,
    notice: false
  };

  public comments: ICommentData[] = [];
  private pointData: IAddPointRequest | null = null; 

  ngOnInit() {
    this.boardId = this.route.snapshot.paramMap.get('boardId');
    if (this.boardId == null) {
      this.dalService.snackBar('해당 게시판을 찾을 수 없습니다.');
      return;
    }

    this.postId = this.route.snapshot.paramMap.get('postId');
    if (this.postId == null) {
      this.dalService.snackBar('해당 게시물을 찾을 수 없습니다.');
      return;
    }

    this.isLoading = true;
    this.isCommentLoading = true;
    of(this.dalService.boardHttp.getDetail(this.boardId, this.postId), this.dalService.commentHttp.getList(this.postId)).pipe(
      mergeMap(request => request),
      tap(response => !response.isSuccess ? this.dalService.snackBar(response.message) : null),
      filter(response => response.isSuccess)
    ).subscribe({
      next: (response) => {
        if (isBoardDetailResponse(response)) {
          this.detailData = response.result;
          this.isLoading = false;
        }

        if (isCommentListResponse(response)) {
          this.comments = [...response.result];
          this.isCommentLoading = false;
        }
      },
      error: (error) => {
        this.dalService.snackBar('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요');
      }
    });
  }

  public enterComment(event: any) {
    if (this.postId == null) {
      this.dalService.snackBar('해당 게시물을 찾을 수 없습니다.');
      return;
    }

    const request: ICommentCreateRequest = {
      userDisplay: this.membershipService.getUser()?.nickname as string,
      parentId: event.parentId ?? null,
      content: event.value
    };

    this.isCommentLoading = true;
    this.dalService.commentHttp.create(this.postId, request)
    .pipe(
      tap(response => {
        this.commentId = response.result.id
                     
        this.pointData = {
          userId: this.membershipService.getUser()?.userId as number,
          category: POINT_CATEGORY.Comment_Create,
          sourceId: this.commentId!,
          source: POINT_SOURCE.Comment
        }; 
      }),
      withLatestFrom(this.dalService.commentHttp.getList(this.postId!), this.dalService.pointHttp.fluctuate(this.pointData!)),
      map(([comment, comments, pointResponse]) => ({ comment, comments, pointResponse })) // 결과 조합,
    )
    .subscribe({
      next: (response) => {
        this.comments = response.comments.result;
        this.isCommentLoading = false;
        
        this.dalService.snackBar(`${response.pointResponse.result.difference} 포인트가 적립되었습니다!`);
        this.globalService.point = response.pointResponse.result.balance;
      },
      error: (error) => {
        this.dalService.snackBar('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요');
      }
    });
  }

  public updateComment(event: ICommnetUpdate) {
    this.dalService.commentHttp.update(event.postId, event.commentId, { content: event.content }).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dalService.snackBar('댓글이 수정되었습니다');
        }
        else {
          this.dalService.snackBar(response.message);
        }
      },
      error: (error) => {
        this.dalService.snackBar('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요');
      }
    })
  }
  
  public deleteComment(event: { postId: number; commentId: number; }) {
    this.dalService.commentHttp.delete(event.postId, event.commentId).pipe(
      tap(response => {
        this.isCommentLoading = true;

        this.pointData = {
          userId: this.membershipService.getUser()?.userId as number,
          category: POINT_CATEGORY.Comment_Delete,
          sourceId: event.commentId,
          source: POINT_SOURCE.Comment
        }; 
      }),
      withLatestFrom(this.dalService.commentHttp.getList(String(event.postId)), this.dalService.pointHttp.fluctuate(this.pointData!)),
      map(([comment, comments, pointResponse]) => ({ comment, comments, pointResponse }))
    ).subscribe({
      next: (response) => {
        this.comments = response.comments.result;
        this.isCommentLoading = false;

        this.dalService.snackBar(`${response.pointResponse.result.difference} 포인트가 차감되었습니다`);
        this.globalService.point = response.pointResponse.result.balance;
        this.isCommentLoading = false;

      },
      error: (error) => {
        this.dalService.snackBar('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요');
      }
    })
  }

  public goBack(): void {
    const board = this.scrollService.boardState.find(board => board.id === this.boardId);
    if (board) {
      board.isBack = true;
      this.location.back();
    }
  }

}