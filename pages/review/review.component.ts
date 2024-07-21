import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { LayoutService } from '../../shared/services/layout.service';
import { Router } from '@angular/router';
import { IReviewListData } from '../../shared/http/review.http';
import { DalService } from '../../shared/services/dal.service';
import { ScrollAbstract } from '../../shared/classes/scroll.abstract';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent extends ScrollAbstract implements OnInit, OnDestroy {

  private readonly router = inject(Router);
  private readonly dalService = inject(DalService);
  public readonly layoutService = inject(LayoutService);

  public list: IReviewListData[] = [];
  private isEnd: boolean = false;

  ngOnInit() {
    if (this.scrollService.reviewState.isBack) {
      this.handleRouter();
      this.scrollService.reviewState.isBack = false;
    }
    else {
      this.loadData();
    }
  }

  protected override handleRouter() {
    const storage = this.scrollService.reviewStorage;

    if (storage.reviewList.isEmpty()) {
      this.loadData();
      return;
    }

    this.list = storage.reviewList;
    this.isLoading = false;

    if (storage.page) {
      this.page = storage.page;
    }

    if (storage.scrollPosition) {
      this.scrollPosition = storage.scrollPosition;
    }
  }

  protected override loadData() {
    if (this.isEnd) return;

    this.isLoading = true;
    this.dalService.reviewHttp.getList('1', this.page).subscribe({
      next: (response) => {
        if (response.result.isEmpty()) {
          this.isEnd = true;
          this.isLoading = false;
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

  public override onNearEndScroll() {
    if (!this.isLoading) {
      this.loadData();
    }
  }

  public applyFilter(event: any) {

  }

  public searchReview(event: any) {

  }

  public write() {
    this.router.navigate(['/review/post']);
  }

  ngOnDestroy() {
    this.scrollService.reviewStorage = {
      reviewList: this.list,
      page: this.page,
      scrollPosition: this.scrollService.currentScrollTop
    }
  }


}
