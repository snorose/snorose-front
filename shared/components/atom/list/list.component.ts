import { Component, Input, OnInit } from '@angular/core';
import { IBoardListData } from '../../../http/board.http';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from '../../../services/layout.service';
import { PINK1 } from '../../../consts/color';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

  @Input() lists: IBoardListData[] = [];

  public name: string | null = null;
  public boardId: string | null = null;
  public PINK1 = PINK1;

  constructor(
    private route: ActivatedRoute,
    private readonly layoutService: LayoutService
  ) { }

  ngOnInit(): void {
    this.layoutService.isShowHeader = false;
    this.name = this.route.snapshot.paramMap.get('name');
    this.boardId = this.route.snapshot.paramMap.get('boardId');
  }

}
