import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewComponent } from './review.component';
import { ReviewDetailComponent } from './components/review-detail/review-detail.component';
import { ReviewPostComponent } from './components/review-post/review-post.component';

export const routes: Routes = [
  {
    path: '',
    component: ReviewComponent
  },
  {
    path: ':postId',
    component: ReviewDetailComponent
  },
  {
    path: 'post',
    component: ReviewPostComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewRoutingModule { }