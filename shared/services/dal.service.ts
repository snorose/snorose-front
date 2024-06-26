import { Injectable } from '@angular/core';
import { ReviewHttp } from '../http/review.http';
import { MembershipHttp } from '../http/membership.http';
import { BoardHttp } from '../http/board.http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PointHttp } from '../http/point.http';
import { CommentHttp } from '../http/comment.http';

@Injectable({
  providedIn: 'root'
})
export class DalService {

  public boardHttp: BoardHttp;
  public reviewHttp: ReviewHttp;
  public membershipHttp: MembershipHttp;
  public pointHttp: PointHttp;
  public commentHttp: CommentHttp;

  constructor(
    private _snackBar: MatSnackBar
  ) {
    this.boardHttp = new BoardHttp();
    this.reviewHttp = new ReviewHttp();
    this.membershipHttp = new MembershipHttp();
    this.pointHttp = new PointHttp();
    this.commentHttp = new CommentHttp();
  }

  public snackBar(text: string, undo: string = "", duration: number = 2000) {
    this._snackBar.open(text, undo, {
      duration: duration,
      horizontalPosition: "center",
      verticalPosition: "bottom",
    });
  }

}
