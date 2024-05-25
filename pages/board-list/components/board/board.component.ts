import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DalService } from '../../../../shared/services/dal.service';
import { IBoardListData } from '../../../../shared/http/board.http';
import { BLUE1 } from '../../../../shared/consts/color';
import { LayoutService } from '../../../../shared/services/layout.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {

  public name: string | null = null;
  public boardId: string | null = null;
  public boardList: IBoardListData[] = [];
  public BLUE1 = BLUE1;

  constructor(
    private route: ActivatedRoute,
    private readonly dalService: DalService,
    public readonly layoutService: LayoutService,
  ) { }

  ngOnInit() {
    console.log('board component oninit');
    this.layoutService.isShowHeader = false;
    this.name = this.route.snapshot.paramMap.get('name');
    this.boardId = this.route.snapshot.paramMap.get('boardId');

    if (this.boardId == null) {
      this.dalService.snackBar('board Id가 없습니다.');
    }
    this.dalService.boardHttp.getBoardList(this.boardId as string, 0).subscribe(response => {
      // console.log('getBoardList response', response);
      this.boardList = response.result;
    });
  }


}
