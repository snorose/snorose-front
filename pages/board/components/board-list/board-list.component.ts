import { Component, OnInit, inject } from '@angular/core';
import { IBoardListData } from '../../../../shared/http/board.http';
import { ActivatedRoute } from '@angular/router';
import { DalService } from '../../../../shared/services/dal.service';
import { LayoutService } from '../../../../shared/services/layout.service';
import { BOARDS } from '../../consts/board';
import { Location } from '@angular/common';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.scss'
})
export class BoardListComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly dalService = inject(DalService);
  public readonly layoutService = inject(LayoutService);
  private readonly location = inject(Location);

  public name: string = '';
  public boardList: IBoardListData[] = [];
  public boardId: string | null = null;

  public page: number = 0;
  public isLoading: boolean = true;

  ngOnInit() {
    this.boardId = this.route.snapshot.paramMap.get('boardId');
    if (this.boardId == null) {
      this.dalService.snackBar('해당 게시판을 찾을 수 없습니다.');
      return;
    }

    const board = BOARDS.find(board => board.id === Number(this.boardId));
    if (board == null) {
      this.dalService.snackBar('해당 게시판을 찾을 수 없습니다.');
      return;
    }
    this.name = board.name;

    this.loadData();
  }

  private loadData() {
    this.isLoading = true;
    if (this.boardId == null) {
      this.dalService.snackBar('해당 게시판을 찾을 수 없습니다.');
      return;
    }

    // this.dalService.boardHttp.getList(this.boardId, this.page).subscribe(response => {
    //   this.boardList = [...this.boardList, ...response.result];
    //   this.page++;

    //   const scrollTop = document.documentElement.scrollTop;
    //   const scrollHeight = document.documentElement.scrollHeight;
    //   const clientHeight = window.innerHeight || document.documentElement.clientHeight;
    //   const scrollPosition = scrollTop + clientHeight;

    //   if (scrollHeight <= scrollPosition) {
    //     this.loadData();
    //   }
    //   this.isLoading = false;
    // });
  }

  public onNearEndScroll() {
    if (!this.isLoading) {
      this.loadData();
    }
  }

  public goBack(): void {
    this.location.back();
  }

}
