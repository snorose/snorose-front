import { Injectable, inject } from '@angular/core';
import { MembershipService } from '../services/membership.service';
import { Router } from '@angular/router';
import { DalService } from '../services/dal.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly router = inject(Router);
  private readonly dalService = inject(DalService);
  private readonly membershipService = inject(MembershipService);

  public isLogin(): boolean {
    if (!this.membershipService.isLogin()) {
      this.router.navigateByUrl('/login');
      this.dalService.snackBar('로그인 후 이용 가능합니다. 로그인 해주세요')
      return false;
    }
    return true;
  }

}
