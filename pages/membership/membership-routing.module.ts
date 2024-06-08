import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembershipComponent } from './membership.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { IdComponent } from './components/find/id/id.component';
import { PasswordComponent } from './components/find/password/password.component';

export const routes: Routes = [
  {
    path: '',
    component: MembershipComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: 'find/id',
    component: IdComponent
  },
  {
    path: 'find/password',
    component: PasswordComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembershipRoutingModule { }