import { Component, Input, OnInit } from '@angular/core';
import { IBoardListData } from '../../../http/board.http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

  @Input() lists: IBoardListData[] = [];

  public name: string | null = null;
  public boardId: string | null = null;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.name = this.route.snapshot.paramMap.get('name');
    this.boardId = this.route.snapshot.paramMap.get('boardId');
  }

}
