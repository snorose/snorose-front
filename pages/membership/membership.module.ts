import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipComponent } from './membership.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SharedModule } from '../../shared/shared.module';
import { MembershipRoutingModule } from './membership-routing.module';
import { IdComponent } from './components/find/id/id.component';
import { PasswordComponent } from './components/find/password/password.component';



@NgModule({
  declarations: [
    MembershipComponent,
    SignInComponent,
    SignUpComponent,
    IdComponent,
    PasswordComponent
  ],
  imports: [
    MembershipRoutingModule,
    SharedModule
  ]
})
export class MembershipModule { }
