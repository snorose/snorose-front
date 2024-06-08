import { Component, OnInit, inject } from '@angular/core';
import { DalService } from '../../../../shared/services/dal.service';
import { IReviewListData } from '../../../../shared/http/review.http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.scss'
})
export class ReviewListComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly dalService = inject(DalService);

  private page: number = 0;
  private isLoading: boolean = true;

  public dataSource: IReviewListData[] = [];
  public displayedColumns: string[] = ['id', 'title', 'userDisplay', 'createdAt'];

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.isLoading = true;
    this.dalService.reviewHttp.getList('1', this.page).subscribe({
      next: (response) => {
        this.dataSource = [...this.dataSource, ...response.result];
        this.page++;
  
        // const scrollTop = document.documentElement.scrollTop;
        // const scrollHeight = document.documentElement.scrollHeight;
        // const clientHeight = window.innerHeight || document.documentElement.clientHeight;
        // const scrollPosition = scrollTop + clientHeight;
  
        // if (scrollHeight <= scrollPosition) {
        //   this.loadData();
        // }
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

  public clickRipple(row: IReviewListData) {
    console.log('row', row);
    this.router.navigate(['/review', row.postId]);
  }

}
