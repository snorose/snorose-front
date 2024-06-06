import { Component } from '@angular/core';
import { BOARDS, Section } from './consts/board';
import { BLUE1 } from '../../shared/consts/color';
import { LayoutService } from '../../shared/services/layout.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

  public boards: Section[] = BOARDS;
  public BLUE1 = BLUE1;

  constructor(public readonly layoutService: LayoutService) { }


  public clickBoard(event: any) {
    console.log('clickBoard');
  }
  
}
