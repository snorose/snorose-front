import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from '../../../../shared/services/global.service';
import { ISignInResponse } from '../../../../shared/http/membership.http';
import { DalService } from '../../../../shared/services/dal.service';
import { MembershipService } from '../../../../shared/services/membership.service';
import { BLUE1 } from '../../../../shared/consts/color';
import { LayoutService } from '../../../../shared/services/layout.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  public hide = true;
  public BLUE1 = BLUE1;

  public loginForm: FormGroup = this.formBuilder.group({
    loginId: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private readonly dalService: DalService,
    public readonly layoutService: LayoutService,
    private readonly membershipService: MembershipService,
  ) { }

  get id() {
    return this.loginForm.get('id');
  }

  get password() {
    return this.loginForm.get('password');
  }

  public onSignInClick() {
    if (!this.loginForm.valid) return;

    this.dalService.membershipHttp.signIn(this.loginForm.value).subscribe((response: ISignInResponse) => {
      if (response.isSuccess) {
        this.membershipService.setUser(response.result);
        this.router.navigateByUrl('/main');
      }
      else {
        this.dalService.snackBar('로그인 정보가 일치하지 않습니다. 다시 로그인 해주세요.');
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
