import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PINK1 } from "../../../../shared/consts/color";
import { IBoardListData } from "../../../../shared/http/board.http";
import { LayoutService } from "../../../../shared/services/layout.service";


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
    this.name = this.route.snapshot.paramMap.get('name');
    this.boardId = this.route.snapshot.paramMap.get('boardId');
  }

}
