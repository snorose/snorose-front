import { Component, Input } from '@angular/core';
import { IBoardListData } from '../../../http/board.http';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  @Input() lists: IBoardListData[] = [];
}
