import { Component, Input } from '@angular/core';
import { BLUE1 } from '../../../../../shared/consts/color';
import { ICommentData } from '../../../../../shared/http/comment.http';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {

  @Input() marginLeft: number = 0;
  @Input() comment: ICommentData = {
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
  }

  public BLUE1 = BLUE1;

}
