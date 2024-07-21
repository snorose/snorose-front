import { Component, inject, OnInit } from '@angular/core';
import { LayoutService } from '../../../../shared/services/layout.service';
import { MembershipService } from '../../../../shared/services/membership.service';
import { DalService } from '../../../../shared/services/dal.service';
import { Router } from '@angular/router';
import { IGetUserResponse, IUserData } from '../../../../shared/http/membership.http';

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html',
  styleUrl: './my-page.component.scss'
})
export class MyPageComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly dalService = inject(DalService);
  public readonly layoutService = inject(LayoutService);
  public readonly membershipService = inject(MembershipService);

  public profile: IUserData | null = null;
  public isLoading: boolean = true;

  ngOnInit(): void {
    this.dalService.membershipHttp.get().subscribe({
      next: (response: IGetUserResponse) => {
        if (response.isSuccess) {
          this.profile = response.result;
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.dalService.snackBar('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요');
      }
    })
  }

  public logout() {
    this.membershipService.removeUser();
    this.dalService.snackBar('로그아웃 되었습니다');
    this.router.navigateByUrl('/main');
  }

}
