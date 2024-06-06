import { Component, OnInit, inject } from '@angular/core';
import { DalService } from '../../../../shared/services/dal.service';
import { IReviewListData } from '../../../../shared/http/review.http';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.scss'
})
export class ReviewListComponent implements OnInit {

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
    this.dalService.reviewHttp.getList(1, this.page).subscribe(response => {
      this.dataSource = [...this.dataSource, ...response.result];
      this.page++;

      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight || document.documentElement.clientHeight;
      const scrollPosition = scrollTop + clientHeight;

      if (scrollHeight <= scrollPosition) {
        this.loadData();
      }
      this.isLoading = false;
    });
  }

  public onNearEndScroll() {
    if (!this.isLoading) {
      this.loadData();
    }
  }

  public clickRow(row: any) {
    console.log('clickRow', row);
  }


}
