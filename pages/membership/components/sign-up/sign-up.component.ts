import { Component, QueryList, ViewChildren, inject } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ISignUpResponse } from '../../../../shared/http/membership.http';
import { Router } from '@angular/router';
import { majorList } from '../../../../shared/data/major.data';
import { DalService } from '../../../../shared/services/dal.service';
import { LayoutService } from '../../../../shared/services/layout.service';
import { BLUE1 } from '../../../../shared/consts/color';
import { Location } from '@angular/common';
import { DynamicFormComponent } from '../../../../shared/components/moleclues/dynamic-form/dynamic-form.component';

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
  
  @ViewChildren(DynamicFormComponent) dynamicFormComponents!: QueryList<DynamicFormComponent>;
  
  private readonly router = inject(Router);
  private readonly dalService = inject(DalService);
  public readonly layoutService = inject(LayoutService);
  private readonly location = inject(Location);

  public hide = true;
  public majorList = majorList;
  public BLUE1 = BLUE1;


  public onSignUpClick(event: any) {
    this.dalService.membershipHttp.signUp(event.value).subscribe({
      next: (response: ISignUpResponse) => {
        console.log('response^^', response);
        if (response.isSuccess) {
          this.dalService.snackBar(`회원가입을 성공했습니다. 로그인 해주세요.`);
          this.router.navigateByUrl('/signIn');
        }
        else {
          console.log('회원가입 실패!');
          this.dalService.snackBar(`${response.message} 다시 회원가입 해주세요.`);
        }
      },
      error: (error) => {
        this.dalService.snackBar('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요');
      }
    });
  }

  public onSubmit(key: string) {
      const formComponent = this.dynamicFormComponents.find(component => component.key === key);

    console.log('key: ', key, ' onSubmit value', formComponent?.dynamicForm.value);
  }
  
  public goBack(): void {
    this.location.back();
  }

}
