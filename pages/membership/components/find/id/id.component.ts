import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { DalService } from '../../../../../shared/services/dal.service';

@Component({
  selector: 'app-id',
  templateUrl: './id.component.html',
  styleUrl: './id.component.scss'
})
export class IdComponent {

  private readonly dalService = inject(DalService);
  private readonly location = inject(Location);

  public isFindId: boolean = false;
  public loginId: string | null = null;

  public onSubmit(event: any) {
    console.log('onSubmit', event);
    this.dalService.membershipHttp.findId(event.value).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.loginId = response.result.loginId;
          this.isFindId = true;
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

  public goBack(): void {
    this.location.back();
  }

}
