import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { IBoardListData } from '../../../../shared/http/board.http';
import { ActivatedRoute, Router } from '@angular/router';
import { DalService } from '../../../../shared/services/dal.service';
import { LayoutService } from '../../../../shared/services/layout.service';
import { BOARDS } from '../../consts/board';
import { ScrollAbstract } from '../../../../shared/classes/scroll.abstract';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.scss'
})
export class BoardListComponent extends ScrollAbstract implements OnInit, OnDestroy {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dalService = inject(DalService);
  public readonly layoutService = inject(LayoutService);

  public name: string = '';
  public boardList: IBoardListData[] = [];
  public boardId: string | null = null;
  private isEnd: boolean = false;

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

    const boardState = this.scrollService.boardState.find(board => board.id === this.boardId);
    if (boardState?.isBack) {
      this.handleRouter();
      boardState.isBack = false;
    }
    else {
      this.loadData();
    }
  }

  protected override handleRouter() {
    const storage = this.scrollService.boardStorage;

    if (storage.boardList.isEmpty()) {
      this.loadData();
      return;
    }

    this.boardList = storage.boardList;
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
    if (this.boardId == null) {
      this.dalService.snackBar('해당 게시판을 찾을 수 없습니다.');
      return;
    }

    this.dalService.boardHttp.getList(this.boardId, this.page).subscribe({
      next: (response) => {
        if (response.result.isEmpty()) {
          this.isEnd = true;
          this.isLoading = false;
          return;
        }
        this.boardList = [...this.boardList, ...response.result];
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

  public goBack(): void {
    this.router.navigateByUrl('/board');
  }

  public write(): void {
    this.router.navigate(['/board', this.boardId, 'post']);
  }

  ngOnDestroy() {
    this.scrollService.boardStorage = {
      boardList: this.boardList,
      page: this.page,
      scrollPosition: this.scrollService.currentScrollTop
    }
  }

}
