import { NgModule } from '@angular/core';
import { MembershipComponent } from './membership.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SharedModule } from '../../shared/shared.module';
import { MembershipRoutingModule } from './membership-routing.module';
import { IdComponent } from './components/find/id/id.component';
import { PasswordComponent } from './components/find/password/password.component';
import { MyPageComponent } from './components/my-page/my-page.component';
import { WithdrawalComponent } from './components/user/withdrawal/withdrawal.component';



@NgModule({
  declarations: [
    MembershipComponent,
    SignInComponent,
    SignUpComponent,
    IdComponent,
    PasswordComponent,
    MyPageComponent,
    WithdrawalComponent
  ],
  imports: [
    MembershipRoutingModule,
    SharedModule
  ]
})
export class MembershipModule { }
