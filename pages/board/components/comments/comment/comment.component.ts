import { Component, ElementRef, EventEmitter, Input , Output, ViewChild, inject } from '@angular/core';
import { BLUE1 } from '../../../../../shared/consts/color';
import { ICommentData } from '../../../../../shared/http/comment.http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../../shared/components/atom/confirm-dialog/confirm-dialog.component';

export interface ICommentReply {
  parentId: number | null;
  postId: number;
  value: string;
}

export interface ICommnetUpdate {
  commentId: number;
  postId: number;
  content: string;
}

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {

  @ViewChild('input', { read: ElementRef, static: true }) input!: ElementRef;

  private readonly dialog = inject(MatDialog);

  @Input() marginLeft: number = 0;
  @Input() comment: ICommentData = {
    id: 0,
    postId: 0,
    userProfile: '송이',
    userDisplay: '송이',
    isWriter: false,
    content: '댓글 입니다.',
    likeCount: 10,
    reportCount: 10,
    createdAt: '2024-01-21',
    updatedAt: '2024-01-21',
    deletedAt: null,
    isVisible: true,
    isUpdated: true,
    isDeleted: false,
    parentId: null,
    children: []
  }
  @Output() enter = new EventEmitter<ICommentReply>();
  @Output() update = new EventEmitter<ICommnetUpdate>();
  @Output() delete = new EventEmitter<{ postId: number; commentId: number; }>();
  
  public isShowReply: boolean = false;
  public isUpdating: boolean = false;
  public BLUE1 = BLUE1;
  public value = this.comment.content;

  public enterComment(event: any) {
    this.enter.emit({
      parentId: this.comment.id,
      postId: this.comment.postId,
      value: event.value
    });
    this.isShowReply = false;
  }

  public updateCommnet(value: string) {
    this.update.emit({
      commentId: this.comment.id,
      postId: this.comment.postId,
      content: value
    });
    this.comment.content = value;
    this.isUpdating = false;
  }

  public deleteComment() {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '댓글 삭제',
        content: '정말로 댓글을 삭제 하시겠습니까?',
        btnYes: '네, 삭제 하겠습니다',
        btnNo: '아니요'
      }
    });

    dialog.afterClosed().subscribe(result => {
      if (!result) return;

      this.delete.emit({
        postId: this.comment.postId,
        commentId: this.comment.id
      });
    });
  }

}
