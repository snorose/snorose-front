import { NgModule } from '@angular/core';
import { ReviewComponent } from './review.component';
import { SharedModule } from '../../shared/shared.module';
import { ReviewRoutingModule } from './review-routing.module';
import { ReviewDetailComponent } from './components/review-detail/review-detail.component';
import { ReviewListComponent } from './components/review-list/review-list.component';
import { ReviewPostComponent } from './components/review-post/review-post.component';



@NgModule({
  declarations: [
    ReviewComponent,
    ReviewDetailComponent,
    ReviewListComponent,
    ReviewPostComponent
  ],
  imports: [
    ReviewRoutingModule,
    SharedModule
  ]
})
export class ReviewModule { }
