import { Component, inject } from '@angular/core';
import { LayoutService } from '../../../../shared/services/layout.service';
import { MembershipService } from '../../../../shared/services/membership.service';
import { DalService } from '../../../../shared/services/dal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html',
  styleUrl: './my-page.component.scss'
})
export class MyPageComponent {

  private readonly router = inject(Router);
  private readonly dalService = inject(DalService);
  public readonly layoutService = inject(LayoutService);
  public readonly membershipService = inject(MembershipService);

  public logout() {
    this.membershipService.removeUser();
    this.dalService.snackBar('로그아웃 되었습니다');
    this.router.navigateByUrl('/main');
  }

}
