import { Component, OnInit, inject } from '@angular/core';
import { IBoardDetailData } from '../../../../shared/http/board.http';
import { ActivatedRoute } from '@angular/router';
import { DalService } from '../../../../shared/services/dal.service';
import { ICommentCreateRequest, ICommentData } from '../../../../shared/http/comment.http';
import { Location } from '@angular/common';
import { LayoutService } from '../../../../shared/services/layout.service';
import { ScrollService } from './../../../../shared/services/scroll.service';
import { MembershipService } from '../../../../shared/services/membership.service';

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

  public boardId: string | null = null;
  public postId: string | null = null;
  public commentId: string | null = null;
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
  //   {
  //   id: 0,
  //     postId: 0,
  //       userProfile: '송이',
  //         userDisplay: '송이',
  //           content: '댓글 입니다.',
  //             likeCount: 10,
  //               reportCount: 10,
  //                 createdAt: '2024-01-21',
  //                   updatedAt: '2024-01-21',
  //                     deletedAt: null,
  //                       isVisible: true,
  //                         isUpdated: true,
  //                           isDeleted: false,
  //                             children: [{
  //                               id: 0,
  //                               postId: 0,
  //                               userProfile: '송이',
  //                               userDisplay: '송이',
  //                               content: '댓글 입니다.',
  //                               likeCount: 10,
  //                               reportCount: 10,
  //                               createdAt: '2024-01-21',
  //                               updatedAt: '2024-01-21',
  //                               deletedAt: null,
  //                               isVisible: true,
  //                               isUpdated: true,
  //                               isDeleted: false,
  //                               children: []
  //                             }]
  // }

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
    this.dalService.boardHttp.getDetail(this.boardId, this.postId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.detailData = response.result;
          this.isLoading = false;
        }
        else {
          this.dalService.snackBar('해당 게시물의 상세정보를 찾을 수 없습니다');
        }
      },
      error: (error) => {
        this.dalService.snackBar('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요');
      }
    });

    this.isCommentLoading = true;
    this.dalService.commentHttp.getList(this.postId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.comments = [...this.comments, ...response.result];
          this.isCommentLoading = false;
        }
        else {
          this.dalService.snackBar('해당 게시물의 댓글을 찾을 수 없습니다');
        }
      },
      error: (error) => {
        this.dalService.snackBar('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요');
      }
    });

  }

  public enterComment(event: any) {
    this.postId = this.route.snapshot.paramMap.get('postId');
    if (this.postId == null) {
      this.dalService.snackBar('해당 게시물을 찾을 수 없습니다.');
      return;
    }

    const request: ICommentCreateRequest = {
      userDisplay: this.membershipService.getUser()?.nickname as string,
      parentId: null,
      content: event.value
    };
    console.log('enterComment request', request);
    this.dalService.commentHttp.create(this.postId, request).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.comments = [...this.comments, response.result];
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

  public goBack(): void {
    const board = this.scrollService.boardState.find(board => board.id === this.boardId);
    if (board) {
      board.isBack = true;
      this.location.back();
    }
  }

}
