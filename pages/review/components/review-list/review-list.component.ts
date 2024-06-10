import { Component, Input, OnInit, inject } from '@angular/core';
import { IReviewListData } from '../../../../shared/http/review.http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.scss'
})
export class ReviewListComponent {

  private readonly router = inject(Router);

  @Input() list: IReviewListData[] = [];

  public clickRipple(row: IReviewListData) {
    console.log('row', row);
    this.router.navigate(['/review', row.postId]);
  }

}
