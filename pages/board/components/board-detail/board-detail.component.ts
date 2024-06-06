import { Component, OnInit, inject } from '@angular/core';
import { IBoardDetailData } from '../../../../shared/http/board.http';
import { ActivatedRoute } from '@angular/router';
import { DalService } from '../../../../shared/services/dal.service';
import { ICommentData } from '../../../../shared/http/comment.http';

@Component({
  selector: 'app-board-detail',
  templateUrl: './board-detail.component.html',
  styleUrl: './board-detail.component.scss'
})
export class BoardDetailComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly dalService = inject(DalService);

  public boardId: string | null = null;
  public postId: string | null = null;
  public commentId: string | null = null;

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

  public comments: ICommentData[] = [{
    id: 0,
    postId: 0,
    userProfile: '송이',
    userDisplay: '송이',
    content: '댓글 입니다.',
    likeCount: 10,
    reportCount: 10,
    createdAt: '2024-01-21',
    updatedAt: '2024-01-21',
    deletedAt: null,
    isVisible: true,
    isUpdated: true,
    isDeleted: false,
    children: [{
      id: 0,
      postId: 0,
      userProfile: '송이',
      userDisplay: '송이',
      content: '댓글 입니다.',
      likeCount: 10,
      reportCount: 10,
      createdAt: '2024-01-21',
      updatedAt: '2024-01-21',
      deletedAt: null,
      isVisible: true,
      isUpdated: true,
      isDeleted: false,
      children: []
    }]
  }];

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

    // this.dalService.boardHttp.getDetail(this.boardId, this.postId).subscribe(response => {
    //   this.detailData = response.result;
    // });

    // this.dalService.commentHttp.getList(this.postId).subscribe(response => {
    //   this.comments = [...this.comments, ...response.result];
    // });

  }

  public enterComment(event: string) {

  }

}