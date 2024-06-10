import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ISignInResponse } from '../../../../shared/http/membership.http';
import { DalService } from '../../../../shared/services/dal.service';
import { MembershipService } from '../../../../shared/services/membership.service';
import { LayoutService } from '../../../../shared/services/layout.service';
import { DynamicFormComponent } from '../../../../shared/components/moleclues/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  @ViewChild(DynamicFormComponent) dynamicFormComponent!: DynamicFormComponent;

  constructor(
    private router: Router,
    private readonly dalService: DalService,
    public readonly layoutService: LayoutService,
    private readonly membershipService: MembershipService,
  ) { }

  public isLoading: boolean = false;

  public onSignInClick(event: any) {
    if (!this.dynamicFormComponent.dynamicForm.valid) return;

    this.isLoading = true;
    this.dalService.membershipHttp.signIn(event.value).subscribe({
      next: (response: ISignInResponse) => {
        if (response.isSuccess) {
          this.membershipService.setUser(response.result);
          this.router.navigateByUrl('/main');
        }
        else {
          this.dalService.snackBar('아이디 혹은 비밀번호가 일치하지 않습니다');
          this.router.navigateByUrl('/signIn');
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.dalService.snackBar('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요');
        this.router.navigateByUrl('/signIn');
        this.isLoading = false;
      }
    });
  }

  public onSignUpClick() {
    this.router.navigateByUrl('/membership/signup');
  }

  public onResetPasswordClick() {
    // 비밀번호 초기화 페이지로 이동
  }
}
