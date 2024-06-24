import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { DynamicFormComponent } from '../../../../shared/components/moleclues/dynamic-form/dynamic-form.component';
import { DalService } from '../../../../shared/services/dal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IPostCreateRequest } from '../../../../shared/http/board.http';
import { MembershipService } from './../../../../shared/services/membership.service';
import { IAddPointRequest } from '../../../../shared/http/point.http';
import { POINT_CATEGORY, POINT_SOURCE } from '../../../../shared/data/point.data';
import { GlobalService } from '../../../../shared/services/global.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/atom/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-board-post',
  templateUrl: './board-post.component.html',
  styleUrl: './board-post.component.scss'
})
export class BoardPostComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly dalService = inject(DalService);
  public globalService = inject(GlobalService);
  private readonly membershipService = inject(MembershipService);

  @ViewChild(DynamicFormComponent) dynamicFormComponent!: DynamicFormComponent;

  public boardId: string | null = null;
  private postId: number | null = null;

  ngOnInit() {
    this.boardId = this.route.snapshot.paramMap.get('boardId');
    if (this.boardId == null) {
      this.dalService.snackBar('해당 게시판을 찾을 수 없습니다.');
      return;
    }
  }

  public post() {
    if (!this.dynamicFormComponent.dynamicForm.valid) {
      this.dalService.snackBar('필수 정보를 모두 입력해 주세요');
      return;
    }
    if (this.boardId == null) {
      this.dalService.snackBar('해당 게시판을 찾을 수 없습니다.');
      return;
    }

    const postData: IPostCreateRequest = {
      title: this.dynamicFormComponent.dynamicForm.value.title,
      content: this.dynamicFormComponent.dynamicForm.value.content,
      userDisplay: this.membershipService.getUser()?.nickname as string
    };

    this.dalService.boardHttp.create(this.boardId, postData).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.postId = response.result.postId;

          const pointData: IAddPointRequest = {
            userId: this.membershipService.getUser()?.userId as number,
            category: POINT_CATEGORY.Post_Create,
            sourceId: this.postId,
            source: POINT_SOURCE.Post
          }
          this.dalService.pointHttp.fluctuate(pointData).subscribe({
            next: (response) => {
              if (response.isSuccess) {
                this.dalService.snackBar(`${response.result.difference} 포인트가 적립되었습니다!`);
                this.globalService.point = response.result.balance;
                this.router.navigate(['/board', this.boardId, this.postId]);
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
        else {
          this.dalService.snackBar(response.message);
        }
      },
      error: (error) => {
        this.dalService.snackBar('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요');
      }
    });
   }

  public closePost() {
    if (this.dynamicFormComponent.dynamicForm.touched) {
      const dialog = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: '작성 삭제',
          content: '작성중인 글을 삭제할까요?',
          btnYes: '삭제',
          btnNo: '취소'
        }
      });

      dialog.afterClosed().subscribe(result => {
        if (!result) return;
        this.router.navigate(['/board', this.boardId]);
      });
    }
    else {
      this.router.navigate(['/board', this.boardId]);
    }
  }

}