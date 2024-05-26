import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BOARDS, Section } from './consts/board';
import { LayoutService } from '../../shared/services/layout.service';
import { BLUE1 } from '../../shared/consts/color';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.scss'
})
export class BoardListComponent {

  public boards: Section[] = BOARDS;
  public BLUE1 = BLUE1;

  constructor(public readonly layoutService: LayoutService) { }


  public clickBoard(event: any) {
    console.log('clickBoard');
  }
}
