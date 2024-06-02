import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ISignUpRequest, ISignUpResponse } from '../../../../shared/http/membership.http';
import { Router } from '@angular/router';
import { majorList } from '../../../../shared/data/major.data';
import { DalService } from '../../../../shared/services/dal.service';
import { DateService } from '../../../../shared/services/date.service';
import { LayoutService } from '../../../../shared/services/layout.service';
import { BLUE1 } from '../../../../shared/consts/color';

// 이름, 숙명 구글 메일, 아이디, 비밀번호, 비밀번호 확인
// 확인코드
// 닉네임, 학번, 전공, 생년월일
// 

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class SignUpComponent {

  public hide = true;
  public majorList = majorList;
  public BLUE1 = BLUE1;



  constructor(
    private router: Router,
    private readonly dalService: DalService,
    private readonly dateService: DateService,
    public readonly layoutService: LayoutService,
  ) { }


  public onSignUpClick(event: any) {
    this.dalService.membershipHttp.signUp(event.value).subscribe((response: ISignUpResponse) => {
      console.log('response^^', response);
      if (response.isSuccess) {
        this.dalService.snackBar(`회원가입을 성공했습니다. 로그인 해주세요.`);
        this.router.navigateByUrl('/signIn');
      }
      else {
        console.log('회원가입 실패!');
        this.dalService.snackBar(`${response.message} 다시 회원가입 해주세요.`);
      }
    });

  }

}
