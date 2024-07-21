import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from '../../pages/membership/components/sign-in/sign-in.component';
import { PageNotFoundComponent } from '../../pages/page-not-found/page-not-found.component';
import { authGuard } from '../../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    loadChildren: () => import('../../pages/main/main.module').then(m => m.MainModule),
  },
  {
    path: 'board',
    loadChildren: () => import('../../pages/board/board.module').then(m => m.BoardModule),
  },
  {
    path: 'membership',
    loadChildren: () => import('../../pages/membership/membership.module').then(m => m.MembershipModule),
  },
  {
    path: 'review',
    loadChildren: () => import('../../pages/review/review.module').then(m => m.ReviewModule),
    canActivate: [authGuard]
  },
  {
    path: 'point',
    loadChildren: () => import('../../pages/point/point.module').then(m => m.PointModule),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: SignInComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
