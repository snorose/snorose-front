import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GlobalService } from '../../shared/services/global.service';
import { merge, startWith, switchMap, map } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { LayoutService } from '../../shared/services/layout.service';
import { DalService } from '../../shared/services/dal.service';

export interface FileData {
  userDisplay: string;
  postId: number,
  title: string;
  createdAt: string;
  likeCount: number;
  viewCount: number;
}

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrl: './file.component.scss'
})
export class FileComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['postId', 'title', 'userDisplay', 'createdAt'];
  public dataSource = new MatTableDataSource<FileData>([]);

  public isLoadingResults: boolean = true;
  public resultsLength: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly dalService: DalService,
    public readonly layoutService: LayoutService,
  ) { }

  ngOnInit(): void {
    this.layoutService.isShowHeader = false;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        //console.log('ngAfterViewInit paginator pageIndex', this.paginator.pageIndex);
        console.log('paginator', this.paginator);
        return this.dalService.reviewHttp.getList(1, this.paginator.pageIndex);
      }),
      map((data) => { // Flip flag to show that loading has finished.
        this.isLoadingResults = false;
        this.resultsLength = 13; //data ? data.result.length : 0; 총 데이터 개수 알려주면 됨!!
        return data ? data.result : [];
      }),
    ).subscribe(data => {
      this.dataSource.data = data
      console.log('ngAfterViewInit paginator data', data);
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
