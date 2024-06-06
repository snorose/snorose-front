import { Component, inject } from '@angular/core';
import { LayoutService } from '../../shared/services/layout.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {

  public readonly layoutService = inject(LayoutService);


  public applyFilter(event: any) {

  }

  public searchReview(event: any) {

  }

}
