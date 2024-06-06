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

  @ViewChild('dynamicFormComponent') dynamicFormComponent!: DynamicFormComponent;

  constructor(
    private router: Router,
    private readonly dalService: DalService,
    public readonly layoutService: LayoutService,
    private readonly membershipService: MembershipService,
  ) { }

  public onSignInClick(event: any) {
    if (!this.dynamicFormComponent.dynamicForm.valid) return;

    this.dalService.membershipHttp.signIn(event.value).subscribe((response: ISignInResponse) => {
      if (response.isSuccess) {
        this.membershipService.setUser(response.result);
        this.router.navigateByUrl('/main');
      }
      else {
        this.dalService.snackBar('아이디 혹은 비밀번호가 일치하지 않습니다');
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
