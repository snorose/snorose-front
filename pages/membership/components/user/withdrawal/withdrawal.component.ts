import { Component, ViewChild, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ConfirmDialogComponent } from '../../../../../shared/components/atom/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DalService } from '../../../../../shared/services/dal.service';
import { DynamicFormComponent } from '../../../../../shared/components/moleclues/dynamic-form/dynamic-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrl: './withdrawal.component.scss'
})
export class WithdrawalComponent {

  @ViewChild(DynamicFormComponent, { static: true }) dynamicFormComponent!: DynamicFormComponent;

  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly location = inject(Location);
  private readonly dalService = inject(DalService);

  public isDelete: boolean = false;

  public goBack(): void {
    this.location.back();
  }

  public markForDelete() {
    this.isDelete = true;
  }

  public withdrawal() {
    if (this.dynamicFormComponent && !this.dynamicFormComponent.dynamicForm.valid) return;
    
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '회원 탈퇴',
        content: '정말로 스노로즈 회원 탈퇴를 하시겠습니까?',
        btnYes: '네, 탈퇴 하겠습니다',
        btnNo: '아니요'
      }
    });

    dialog.afterClosed().subscribe(result => {
      if (!result) return;

      this.dalService.membershipHttp.delete(this.dynamicFormComponent.dynamicForm.value.currentPassword).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.dalService.snackBar(response.result);
            this.router.navigateByUrl('/main');
          }
          else {
            this.dalService.snackBar(response.message);
          }
        },
        error: (error) => {
          this.dalService.snackBar('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요');
        }
      });
    })
  }

}
