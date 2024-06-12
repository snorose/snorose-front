import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewComponent } from './review.component';
import { ReviewDetailComponent } from './components/review-detail/review-detail.component';
import { ReviewPostComponent } from './components/review-post/review-post.component';
import { authGuard } from '../../shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: ReviewComponent
  },
  {
    path: 'post',
    component: ReviewPostComponent,
    canActivate: [authGuard]
  },
  {
    path: ':postId',
    component: ReviewDetailComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewRoutingModule { }