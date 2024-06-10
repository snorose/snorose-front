import { Component, OnInit, inject } from '@angular/core';
import { LayoutService } from '../../shared/services/layout.service';
import { Router } from '@angular/router';
import { IReviewListData } from '../../shared/http/review.http';
import { DalService } from '../../shared/services/dal.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly dalService = inject(DalService);
  public readonly layoutService = inject(LayoutService);

  public list: IReviewListData[] = [];

  private page: number = 0;
  private isLoading: boolean = true;
  private isEnd: boolean = false;

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    if (this.isEnd) return;

    this.isLoading = true;
    this.dalService.reviewHttp.getList('1', this.page).subscribe({
      next: (response) => {
        if (response.result.isEmpty()) {
          this.isEnd = true;
          return;
        }
        this.list = [...this.list, ...response.result];
        this.page++;
        this.isLoading = false;
      },
      error: (error) => {
        this.dalService.snackBar('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요');
      }
    });
  }

  public onNearEndScroll() {
    if (!this.isLoading) {
      this.loadData();
    }
  }

  public applyFilter(event: any) {

  }

  public searchReview(event: any) {

  }

}
