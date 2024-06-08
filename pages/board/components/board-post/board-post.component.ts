import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { DynamicFormComponent } from '../../../../shared/components/moleclues/dynamic-form/dynamic-form.component';
import { DalService } from '../../../../shared/services/dal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IPostCreateRequest } from '../../../../shared/http/board.http';
import { MembershipService } from './../../../../shared/services/membership.service';

@Component({
  selector: 'app-board-post',
  templateUrl: './board-post.component.html',
  styleUrl: './board-post.component.scss'
})
export class BoardPostComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dalService = inject(DalService);
  private readonly membershipService = inject(MembershipService);

  @ViewChild(DynamicFormComponent) dynamicFormComponent!: DynamicFormComponent;

  public boardId: string | null = null;

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
      userdisplay: this.membershipService.getUser()?.nickname as string
    };

    console.log('postData', postData);
    this.dalService.boardHttp.create(this.boardId, postData).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dalService.snackBar('10 포인트 적립');
          this.router.navigate(['/board', this.boardId, response.result.postId]);
        }
      },
      error: (error) => {
        this.dalService.snackBar('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요');
      }
    });
  }

  public closePost() {
    this.router.navigate(['/board', this.boardId]);
  }

}
